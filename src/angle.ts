const TAU = Math.PI * 2;

export default class Angle {

    /** Normalizes any angle in radians to [ 0, TAU ]. */
    static normalize(angle: number): number {
        angle %= TAU;
        return angle >= 0 ? angle : angle + TAU;
    }

    /** Returns difference between [ -PI, PI ] radians, input doesn't have to be normalized. */
    static dist(angle1: number, angle2: number): number {
        let a = angle2 - angle1;
        a = (a + Math.PI) % TAU;
        return a <= 0 ? (a + Math.PI) : (a - Math.PI);
    }
}
