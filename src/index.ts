import * as PIXI from 'pixi.js';
import { Graphics } from './pixiExtensions';
import World from './world';

window.onload = () => {
    const elem = document.getElementById('display')!;    
    const app = new PIXI.Application({
        antialias: true,
        transparent: false,
        width: elem.clientWidth,
        height: elem.clientHeight,
        backgroundColor: 0xE0E0FF
    });
    elem.appendChild(app.view);
    
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
};
