import Entity from "../entity";
import Geom from "../geom";
import World from "../world";
import DistanceProvider from "./distanceProvider";
import EntityDistance from "./entityDistance";

/**
 * Slices the world into a grid of chunks which contain entities.
 * Only calculate exact distance to entities in nearby chunks, this improves performance vs calculating distances to all entities.
 */
export default class GridDistanceProvider implements DistanceProvider {
    private width = 0;
    private height = 0;

    private grid = [] as Entity[][];

    constructor(private world: World, private chunkSize: number) { }
    
    init(): void {
        this.width = Math.ceil(this.world.width / this.chunkSize);
        this.height = Math.ceil(this.world.height / this.chunkSize);
    }

    update(): void {
        this.grid = Array.from({ length: this.width * this.height }, () => []);

        for(const ent of this.world.entities) {
            const [x, y] = this.getEntityChunk(ent);
            this.grid[x + (y * this.width)].push(ent);
        }
    }

    *getNearbyEntities(self: Entity, range: number): Iterable<Entity> {
        const chunkDist = Math.ceil(range / this.chunkSize);
        const [ownX, ownY] = this.getEntityChunk(self);

        const borderSize = 1 + (2 * chunkDist); // 1: 3x3; 2: 5x5; 3: 7x7; etc
        for(let xc = 0; xc < borderSize; xc++) {
            for(let yc = 0; yc < borderSize; yc++) {
                const x = ownX - chunkDist + xc;
                const y = ownY - chunkDist + yc;

                if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    for(const near of this.grid[x + (y * this.width)]) {
                        yield near;
                    }
                }
            }
        }
    }

    *getNearbyEntityDistances(self: Entity, range: number): Iterable<EntityDistance> {
        for(const ent of this.getNearbyEntities(self, range)) {
            const dist = Geom.Point.dist(self.position, ent.position);
            if(dist <= range) {
                yield { entity: ent, dist: dist }
            }
        }
    }

    private getEntityChunk(entity: Entity) : [number, number] {
        const x = Math.floor(entity.position.x / this.chunkSize);
        const y = Math.floor(entity.position.y / this.chunkSize);
        return [x, y];
    }
}
