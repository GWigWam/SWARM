import Point from './point';
import Geom from './geom';

class Shape implements Point {
    x: number = 0;
    y: number = 0;
    
    private _a: number = 0;
    get angle(): number {
        return this._a;
    }
    set angle(v: number) {
        this._a = Geom.Angle.normalize(v);
    }
    get angleDeg(): number {
        return this._a * (180 / Math.PI);
    }

    constructor(public shape: Point[], pos: Point|null = null) {
        if(pos) {
            this.x = pos.x;
            this.y = pos.y;
        }
    }

    renderPoly = (): Point[] =>
        this.shape.map(p => {
            let x = ((p.y * Math.sin(this.angle)) + (p.x * Math.cos(this.angle))) + this.x;
            let y = ((p.y * Math.cos(this.angle)) - (p.x * Math.sin(this.angle))) + this.y;
            return { x, y };
        });

    static fromNrs(pos: Point, ... points: number[]): Shape {
        const ps: Point[] = [];
        for(let i = 0; i < points.length; i+=2) {
            ps.push({ x: points[i], y: points[i + 1] });
        }
        return new Shape(ps, pos);
    }
}

export default Shape;
