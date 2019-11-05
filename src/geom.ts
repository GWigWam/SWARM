import Point from "./point";

class AngleGeom {
    /** Normalizes any angle in radians to [ 0, TAU ]. */
    normalize(angle: number): number {
        angle %= Geom.TAU;
        return angle >= 0 ? angle : angle + Geom.TAU;
    }

    /** Returns difference between [ -PI, PI ] radians, input doesn't have to be normalized. */
    dist(angle1: number, angle2: number): number {
        let a = angle2 - angle1;
        a = (a + Math.PI) % Geom.TAU;
        return a <= 0 ? (a + Math.PI) : (a - Math.PI);
    }
}

class PointGeom {
    /** Returns the distance between 2 points */
    dist(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
}

export default class Geom {
    static readonly TAU: number = Math.PI * 2;
    static readonly HALF_PI: number = Math.PI * 0.5;

    static readonly Angle: AngleGeom = new AngleGeom();
    static readonly Point: PointGeom = new PointGeom();
}
