interface Point {
    x: number,
    y: number
}

class Shape implements Point {
    x: number = 0;
    y: number = 0;
    
    private _a: number = 0;
    get angle(): number {
        return this._a;
    }
    set angle(v: number) {
        v %= (Math.PI * 2);
        this._a = v > 0 ? v : (v + 2 * Math.PI);
    }
    get angleDeg(): number {
        return this._a * (180 / Math.PI);
    }

    constructor(public shape: Point[]) { }

    renderPoly = (): Point[] =>
        this.shape.map(p => {
            let x = ((p.y * Math.sin(this.angle)) + (p.x * Math.cos(this.angle))) + this.x;
            let y = ((p.y * Math.cos(this.angle)) - (p.x * Math.sin(this.angle))) + this.y;
            return { x, y };
        });

    static fromNrs(... points: number[]): Shape {
        const ps: Point[] = [];
        for(let i = 0; i < points.length; i+=2) {
            ps.push({ x: points[i], y: points[i + 1] });
        }
        return new Shape(ps);
    }
}

import { Graphics, Point as PixiPoint } from 'pixi.js';
declare module 'pixi.js' {
    export interface Graphics {
        drawPolyShape(shape: Shape): void;
    }
}

Graphics.prototype.drawPolyShape = function(shape: Shape) {
    this.drawPolygon(shape.renderPoly().map(p => new PixiPoint(p.x, p.y)));
}

export default Shape;
