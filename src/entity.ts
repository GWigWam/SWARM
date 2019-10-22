import { Drawable } from './drawing';
import Shape from './shape';

export default abstract class Entity implements Drawable {
        
    constructor(public position: Shape, public color: number) { }

    abstract update(timeSec: number): void;

    getGraphics = () => [{ color: this.color, shape: this.position.renderPoly() }];
}
