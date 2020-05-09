import Entity from "./entity";
import Shape from "./shape";
import Point from "./point";
import World from "./world";
import Geom from "./geom";
import Settings from "./settings"

const _shape = [7, 0, -5, 4, 0, 0, -5, -4] as number[];
const _color = 0xBB2222;
const _turnRate = (Geom.TAU) * 1.0;

interface BirdDistance {
    entity: Entity;
    dist: number;
}

const speed = Settings.add('bird_speed', 200);
const avoidDist = Settings.add('bird_avoidDist', 15);
const groupDist = Settings.add('bird_groupDist', 50);
const avoidBOPDist = Settings.add('bird_avoidBOPDist', 75);

export default class Bird extends Entity {
    
    public readonly entityType = 'Bird';

    constructor(public world: World, pos: Point, angle: number|null = null) {
        super(Shape.fromNrs(pos, ... _shape), _color);
        this.position.angle = angle || 0;
    }

    update(timeSec: number): void {
        this.update_angle(timeSec);
        this.move_bySpeed(speed.value, timeSec);
    }

    private update_angle(timeSec: number): void {
        const close = this.closeBirds();

        let target = this.avoidPredators();
        if(target == null) {
            target = this.avoidBirds(close);
        }
        if(target == null) {
            target = this.swarm(close);
        }

        if(target != null) {
            this.turn(target, _turnRate, timeSec)
        }
    }

    private avoidPredators(): number|null {
        const bops = this.world.entities
            .filter(e => e.entityType == 'BirdOfPrey')
            .map(e => ({ entity: e, dist: Geom.Point.dist(e.position, this.position) }))
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

    private avoidBirds(close: BirdDistance[]): number|null {
        const avoidBird = (avoid: BirdDistance) => {
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

        return close
            .filter(d => d.dist <= avoidDist.value)
            .map(avoidBird)
            .reduce((p, c) =>
                p != null ?
                    c != null ? p + c : p :
                    c != null ? c : null,
                null);
    }

    private swarm(close: BirdDistance[]): number|null {
        close = close.filter(d => d.dist <= groupDist.value);
        if(close.length > 0) {
            const centreOfMass = close
                .map(d => d.entity.position)
                .reduce((acc, cur) => ({ x: acc.x + (cur.x / close.length), y: acc.y + (cur.y / close.length) }), { x: 0, y: 0})
            const distToCentre = Geom.Point.dist(this.position, centreOfMass);

            if(distToCentre > groupDist.value * 0.5) { // Move closer to group
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
            .filter(e => e.entityType == this.entityType)
            .filter(e => e != this)
            .map(e => ({ entity: e, dist: Geom.Point.dist(e.position, this.position) }));
    }
}
