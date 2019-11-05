import * as PIXI from 'pixi.js';
import { Graphics } from './pixiExtensions';
import World from './world';

const app = new PIXI.Application({
    antialias: true,
    transparent: false,
    width: document.body.clientWidth - 30,
    height: document.body.clientHeight - 30,
    backgroundColor: 0xE0E0FF
});
document.body.appendChild(app.view);

const graphics = new Graphics();
app.stage.addChild(graphics);

const world = new World(app.view.width, app.view.height);

app.ticker.add(() => {
    const elapsedSec = app.ticker.elapsedMS / 1000;    
    world.update(elapsedSec);
    
    graphics.clear();
    for(let g of world.getGraphics()) {
        graphics.drawGraphic(g);
    }
});
