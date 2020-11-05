import { Drawable } from './drawing';
import Entity from './entity';
import Bird from './bird';
import BirdOfPrey from './birdOfPrey';
import Settings from "./settings";
import Geom from './geom';

const no_birds = Settings.add('world_no_birds', 250);
const no_bops = Settings.add('world_no_bops', 3);

export interface EntityDistance {
    entity: Entity;
    dist: number;
}

export default class World implements Drawable {

    entities = [] as Entity[];
    distsCache = [] as EntityDistance[][];

    constructor(public width: number, public height: number) {
        this.init();
        no_birds.watch(_ => this.init());
        no_bops.watch(_ => this.init());
    }

    update(timeSec: number) {
        this.updateDistCache();
        for(let ent of this.entities) {
            ent.update(timeSec);

            ent.position.x = ((ent.position.x + this.width) % this.width);
            ent.position.y = ((ent.position.y + this.height) % this.height);
        }
    }

    private updateDistCache() {
        for(let e1 of this.entities) {
            for(let e2 of this.entities) {
                if(e2.id > e1.id) {
                    const dist = Geom.Point.dist(e1.position, e2.position);
                    this.distsCache[e1.id][e2.id].dist = dist;
                    this.distsCache[e2.id][e1.id].dist = dist;
                }
            }
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

        this.distsCache = [];
        for(const e1 of this.entities) {
            this.distsCache[e1.id] = [];
            for(const e2 of this.entities) {
                this.distsCache[e1.id][e2.id] = { entity: e2, dist: 0 };
            }
        }
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

    public getDistances(e: Entity) : EntityDistance[] {
        return this.distsCache[e.id];
    }
}
