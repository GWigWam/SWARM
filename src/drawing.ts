import Point from './point';

interface Graphic {
    shape: Point[];
    color: number;
}

interface Drawable {
    getGraphics(): Iterable<Graphic>
}

export { Graphic, Drawable };
