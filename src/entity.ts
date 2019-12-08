import { Drawable } from './drawing';
import Shape from './shape';
import Geom from "./geom";

export default abstract class Entity implements Drawable {
        
    constructor(public position: Shape, public color: number) { }

    abstract update(timeSec: number): void;

    public *getGraphics() {
        yield { color: this.color, shape: this.position.renderPoly() };
    }

    protected move_bySpeed(speed: number, timeSec: number): void {
        this.move_byDist(speed * timeSec);
    }

    protected move_byDist(dist: number): void {
        this.position.x += dist * Math.cos(this.position.angle);
        this.position.y -= dist * Math.sin(this.position.angle);
    }

    protected turn(targetAngle: number, turnRate: number, timeSec: number): void {
        const maxTurn = turnRate * timeSec;
        const delta = Geom.Angle.dist(this.position.angle, targetAngle);

        if(Math.abs(delta) > maxTurn) {
            this.position.angle += maxTurn * (delta > 0 ? 1 : -1);
        } else {
            this.position.angle = targetAngle;
        }
    }
}
