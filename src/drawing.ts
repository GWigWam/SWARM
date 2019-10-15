import Point from './point';

interface Graphic {
    shape: Point[];
    color: number;
}

interface Drawable {
    getGraphics(): Graphic[];
}

export { Graphic, Drawable };
