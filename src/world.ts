import { Drawable, Graphic } from './drawing';
import Entity from './entity';

export default class World implements Drawable {

    entities: Entity[];

    constructor(public width: number, public height: number) {
        this.entities = [];   
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
}
