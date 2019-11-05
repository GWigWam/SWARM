import Entity from "./entity";
import Shape from "./shape";
import Point from "./point";
import World from "./world";
import Geom from "./geom";

const _shape = [20, 0, -15, 10, 0, 0, -15, -10] as number[];
const _color = 0xBB2222;
const _speed = 150;
const _turnRate = (Geom.TAU) * 0.5;

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
        let target =
            this.avoidWall();
        
        if(target != null) {
            this.turn(target, _turnRate, timeSec)
        }
    }

    private avoidWall(): number|null {
        const avoidDist = 100;
        const bounceDist = 20;
        const a = this.position.angle;

        const bounce =
            this.position.y < bounceDist ? Math.PI * 1.5 : // TOP
            (this.world.width - this.position.x) < bounceDist ? Math.PI : // RIGHT
            (this.world.height - this.position.y) < bounceDist ? Math.PI * 0.5 : // BOT
            this.position.x < bounceDist ? 0 : // LEFT
                null;
        if(bounce != null) { return bounce; }

        if(a > 0 && a < Math.PI) { // TOP
            const x = this.position.x - Math.tan(a - (Math.PI * 0.5)) * this.position.y;
            if(x > 0 && x < this.world.width) {
                if(Geom.Point.dist(this.position, { x, y: 0 }) < avoidDist) {
                    return Math.PI * 1.5;
                }
            }
        }

        if(a < Geom.HALF_PI || a > Math.PI * 1.5) { // RIGHT
            const y = this.position.y - Math.tan(a) * (this.world.width - this.position.x);
            if(y > 0 && y < this.world.height) {
                if(Geom.Point.dist(this.position, { x: this.world.width, y }) < avoidDist) {
                    return Math.PI;
                }
            }
        }

        if(a > Math.PI) { // BOT
            const x = this.position.x - Math.tan(a - (Math.PI * 1.5)) * (this.world.height - this.position.y);
            if(x > 0 && x < this.world.width) {
                if(Geom.Point.dist(this.position, { x, y: this.world.height }) < avoidDist) {
                    return Geom.HALF_PI;
                }
            }
        }

        if(a > Geom.HALF_PI && a < Math.PI * 1.5) { // LEFT
            const y = this.position.y + Math.tan(a) * this.position.x;
            if(y > 0 && y < this.world.height) {
                if(Geom.Point.dist(this.position, { x: 0, y }) < avoidDist) {
                    return 0;
                }
            }
        }

        return null;
    }
}
