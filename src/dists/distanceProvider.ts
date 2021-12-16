import Entity from "../entity";
import EntityDistance from "./entityDistance";

export default interface DistanceProvider {
    init(): void;
    update(): void;

    getNearbyEntities(self: Entity, range: number): Iterable<Entity>;
    getNearbyEntityDistances(self: Entity, range: number): Iterable<EntityDistance>;
}
