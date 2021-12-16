import entity from "../entity";
import Geom from "../geom";
import World from "../world";
import DistanceProvider from "./distanceProvider";
import EntityDistance from "./entityDistance";

export default class CachedDistanceProvider implements DistanceProvider {

    distsCache = [] as EntityDistance[][];

    constructor(private world: World) { }

    init(): void {
        this.distsCache = [];
        for(const e1 of this.world.entities) {
            this.distsCache[e1.id] = [];
            for(const e2 of this.world.entities) {
                this.distsCache[e1.id][e2.id] = { entity: e2, dist: 0 };
            }
        }
    }

    update(): void {
        for(let e1 of this.world.entities) {
            for(let e2 of this.world.entities) {
                if(e2.id > e1.id) {
                    const dist = Geom.Point.dist(e1.position, e2.position);
                    this.distsCache[e1.id][e2.id].dist = dist;
                    this.distsCache[e2.id][e1.id].dist = dist;
                }
            }
        }
    }

    *getNearbyEntities(self: entity, range: number): Iterable<entity> {
        for(const near of this.getNearbyEntityDistances(self, range)) {
            yield near.entity;
        }
    }

    *getNearbyEntityDistances(self: entity, range: number): Iterable<EntityDistance> {
        for(const near of this.distsCache[self.id]) {
            if(near.dist <= range) {
                yield near;
            }
        }
    }
}
