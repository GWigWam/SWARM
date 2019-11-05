import { Drawable, Graphic } from './drawing';
import Entity from './entity';
import Bird from './bird';

export default class World implements Drawable {

    entities: Entity[];

    constructor(public width: number, public height: number) {
        this.entities = [ ... this.seed(100) ];
    }

    update(timeSec: number) {
        for(let ent of this.entities) {
            ent.update(timeSec);
        }
    }

    getGraphics = (): Graphic[] =>
        this.entities
            .map(e => e.getGraphics())
            .reduce((acc, cur) => acc.concat(cur));

    private *seed(birdCnt: number) {
        const margin = 10;
        for(let i = 0; i < birdCnt; i++) {
            const x = Math.random() * (this.width - (margin * 2)) + margin;
            const y = Math.random() * (this.height - (margin * 2)) + margin;
            const a = Math.random() * Math.PI * 2;
            yield new Bird(this, {x, y}, a);
        }
    }    
}
