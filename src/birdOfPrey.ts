import Entity from "./entity";
import Shape from "./shape";
import Point from "./point";
import World from "./world";
import Geom from "./geom";
import Settings from "./settings";

const _shape = [20, 0, -15, 18, -5, 5, -10, 0, -5, -5, -15, -18] as number[];
const _color = 0x692300;
const _turnRate = (Geom.TAU) * 0.2;

const randomAngleChangesPerSecond = 1 / 4;

const speed = Settings.add('bop_speed', 300);

export default class BirdOfPrey extends Entity {

    public readonly entityType = 'BirdOfPrey';

    private targetAngle: number = 0;

    constructor(public world: World, pos: Point, angle: number|null = null) {
        super(Shape.fromNrs(pos, ... _shape), _color);
        this.targetAngle = this.position.angle = angle || 0;
    }

    update(timeSec: number): void {
        this.update_angle(timeSec);
        this.move_bySpeed(speed.value, timeSec);
    }

    private update_angle(timeSec: number): void {
        if(this.targetAngle != this.position.angle) {
            this.turn(this.targetAngle, _turnRate, timeSec);
        } else {
            if(Math.random() < randomAngleChangesPerSecond * timeSec) {
                this.targetAngle = Math.random() * Geom.TAU;
            }
        }
    }
}
