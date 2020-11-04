import { Drawable } from './drawing';
import Entity from './entity';
import Bird from './bird';
import BirdOfPrey from './birdOfPrey';
import Settings from "./settings";

const no_birds = Settings.add('world_no_birds', 250);
const no_bops = Settings.add('world_no_bops', 3);

export default class World implements Drawable {

    entities = [] as Entity[];

    constructor(public width: number, public height: number) {
        this.init();
        no_birds.watch(_ => this.init());
        no_bops.watch(_ => this.init());
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

    private init() {
        this.entities = [ ... this.seed() ];
    }

    private *seed() {
        let id = 0;
        const margin = 10;
        for(let i = 0; i < no_birds.value; i++) {
            const x = Math.random() * (this.width - (margin * 2)) + margin;
            const y = Math.random() * (this.height - (margin * 2)) + margin;
            const a = Math.random() * Math.PI * 2;
            yield new Bird(this, {x, y}, a, id++);
        }

        for(let i = 0; i < no_bops.value; i++) {
            yield new BirdOfPrey(this, { x: this.width / 2, y: this.height / 2 }, Math.random() * Math.PI * 2, id++);
        }
    }    
}
