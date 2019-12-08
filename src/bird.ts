import Entity from "./entity";
import Shape from "./shape";
import Point from "./point";
import World from "./world";
import Geom from "./geom";

const _shape = [15, 0, -11, 8, 0, 0, -11, -8] as number[];
const _color = 0xBB2222;
const _speed = 200;
const _turnRate = (Geom.TAU) * 1.0;

const avoidDist = 40;
const groupDist = 60;

interface BirdDistance {
    entity: Entity;
    dist: number;
}

export default class Bird extends Entity {
    
    constructor(public world: World, pos: Point, angle: number|null = null) {
        super(Shape.fromNrs(pos, ... _shape), _color);
        this.position.angle = angle || 0;
    }

    update(timeSec: number): void {
        this.update_angle(timeSec);
        this.move_bySpeed(_speed, timeSec);
    }

    private update_angle(timeSec: number): void {
        const close = this.closeBirds();

        let target = this.avoidBirds(close);
        if(target == null) {
            target = this.swarm(close);
        }

        if(target != null) {
            this.turn(target, _turnRate, timeSec)
        }
    }

    private avoidBirds(close: BirdDistance[]): number|null {
        if(close.length > 0) {
            const closest = close[0];
            if(closest.dist <= avoidDist) {
                const da = Geom.Point.getAngle(this.position, closest.entity.position);

                // Do not avoid birds behind you
                if(Math.abs(Geom.Angle.dist(this.position.angle, da)) > Geom.HALF_PI) {
                    return null;
                }

                const r0 = da + Math.PI * 0.51;
                const r1 = da - Math.PI * 0.51;
                const res = Math.abs(Geom.Angle.dist(this.position.angle, r0)) < Math.abs(Geom.Angle.dist(this.position.angle, r1)) ? r0 : r1;
                return res;
            }
        }

        return null;
    }

    private swarm(close: BirdDistance[]): number|null {
        close = close.filter(d => d.dist <= groupDist);
        if(close.length > 0) {
            const centreOfMass = close
                .map(d => d.entity.position)
                .reduce((acc, cur) => ({ x: acc.x + (cur.x / close.length), y: acc.y + (cur.y / close.length) }), { x: 0, y: 0})
            const distToCentre = Geom.Point.dist(this.position, centreOfMass);

            if(distToCentre > groupDist * 0.5) { // Move closer to group
                const res = Geom.Point.getAngle(this.position, centreOfMass);
                return res;
            } else { // Align with group
                const avgAngle = close
                    .reduce((acc, cur) => acc + (cur.entity.position.angle / close.length), 0);
                return avgAngle;
            }
        }

        return null;
    }

    private closeBirds(): BirdDistance[] {
        return this.world.entities
            .filter(e => e != this)
            .map(e => ({ entity: e, dist: Geom.Point.dist(e.position, this.position) }))
            .sort((e1, e2) => e1.dist <= e2.dist ? -1 : 1);
    }
}
