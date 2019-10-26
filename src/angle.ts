const TAU = Math.PI * 2;

export default class Angle {
    static normalize(angle: number): number {
        angle %= TAU;
        return angle >= 0 ? angle : angle + TAU;
    }
}
