import Entity from "./entity";
import Shape from "./shape";
import Point from "./point";
import World from "./world";
import { EntityDistance } from "./world";
import Geom from "./geom";
import Settings from "./settings"

const _shape = [7, 0, -5, 4, 0, 0, -5, -4] as number[];
const _color = 0xBB2222;
const _turnRate = (Geom.TAU) * 1.0;

const speed = Settings.add('bird_speed', 200);
const avoidDist = Settings.add('bird_avoidDist', 15);
const groupDist = Settings.add('bird_groupDist', 50);
const avoidBOPDist = Settings.add('bird_avoidBOPDist', 75);

export default class Bird extends Entity {
    
    public readonly entityType = 'Bird';
    private distances = null as null|EntityDistance[];

    constructor(public world: World, pos: Point, angle: number|null = null, id: number) {
        super(Shape.fromNrs(pos, ... _shape), _color, id);
        this.position.angle = angle || 0;
    }

    update(timeSec: number): void {
        if(this.distances == null) {
            this.distances = this.world.getDistances(this);
        }
        this.update_angle(timeSec, this.distances);
        this.move_bySpeed(speed.value, timeSec);
    }

    private update_angle(timeSec: number, distances: EntityDistance[]): void {
        let target = this.avoidPredators(distances);
        if(target == null) {
            target = this.avoidBirds(distances);
        }
        if(target == null) {
            target = this.swarm(distances);
        }

        if(target != null) {
            this.turn(target, _turnRate, timeSec)
        }
    }

    private avoidPredators(distances: EntityDistance[]): number|null {
        const bops = distances
            .filter(e => e.entity.entityType == 'BirdOfPrey')
            .filter(m => m.dist <= avoidBOPDist.value)
            .sort((e1, e2) => e1.dist <= e2.dist ? -1 : 1);
        if(bops.length > 0)
        {
            const bop = bops[0];
            const a = Geom.Point.getAngle(this.position, bop.entity.position);
            return a + Math.PI;
        }
        return null;
    }

    private avoidBirds(distances: EntityDistance[]): number|null {
        const avoidBird = (avoid: EntityDistance) => {
            const da = Geom.Point.getAngle(this.position, avoid.entity.position);

            // Do not avoid birds behind you
            if(Math.abs(Geom.Angle.dist(this.position.angle, da)) > Geom.HALF_PI) {
                return null;
            }

            const r0 = da + Math.PI * 0.51;
            const r1 = da - Math.PI * 0.51;
            const res = Math.abs(Geom.Angle.dist(this.position.angle, r0)) < Math.abs(Geom.Angle.dist(this.position.angle, r1)) ? r0 : r1;
            return res;
        }

        return distances
            .filter(d =>
                d.entity.entityType == this.entityType &&
                d.entity != this &&
                d.dist <= avoidDist.value)
            .map(avoidBird)
            .reduce((p, c) =>
                p != null ?
                    c != null ? p + c : p :
                    c != null ? c : null,
                null);
    }

    private swarm(distances: EntityDistance[]): number|null {
        distances = distances.filter(d =>
            d.entity.entityType == this.entityType &&
            d.entity != this &&
            d.dist <= groupDist.value);
        if(distances.length > 0) {
            const centreOfMass = distances
                .map(d => d.entity.position)
                .reduce((acc, cur) => ({ x: acc.x + (cur.x / distances.length), y: acc.y + (cur.y / distances.length) }), { x: 0, y: 0})
            const distToCentre = Geom.Point.dist(this.position, centreOfMass);

            if(distToCentre > groupDist.value * 0.5) { // Move closer to group
                const res = Geom.Point.getAngle(this.position, centreOfMass);
                return res;
            } else { // Align with group
                const avgAngle = distances
                    .reduce((acc, cur) => acc + (cur.entity.position.angle / distances.length), 0);
                return avgAngle;
            }
        }

        return null;
    }
}
