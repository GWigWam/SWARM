import Entity from "../entity";
import Geom from "../geom";
import World from "../world";
import DistanceProvider from "./distanceProvider";
import EntityDistance from "./entityDistance";

export default class SimpleDistanceProvider implements DistanceProvider {
    constructor(private world: World) { }
    
    init(): void { }

    update(): void { }

    *getNearbyEntities(self: Entity, range: number): Iterable<Entity> {
        for(const ed of this.getNearbyEntityDistances(self, range)) {
            yield ed.entity;
        }
    }

    *getNearbyEntityDistances(self: Entity, range: number): Iterable<EntityDistance> {
        for(const ent of this.world.entities) {
            const dist = Geom.Point.dist(self.position, ent.position);
            if(dist <= range) {
                yield { entity: ent, dist: dist }
            }
        }
    }
}
