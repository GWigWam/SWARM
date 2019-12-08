import { Drawable, Graphic } from './drawing';
import Entity from './entity';
import Bird from './bird';

export default class World implements Drawable {

    entities: Entity[];

    constructor(public width: number, public height: number) {
        this.entities = [ ... this.seed(200) ];
    }

    update(timeSec: number) {
        for(let ent of this.entities) {
            ent.update(timeSec);

            ent.position.x = ((ent.position.x + this.width) % this.width);
            ent.position.y = ((ent.position.y + this.height) % this.height);
        }
    }

    public *getGraphics() {
        for(let gs of this.entities.map(e => e.getGraphics())) {
             for(let g of gs) {
                 yield g;
             }
        }
    }

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
