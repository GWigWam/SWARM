import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    antialias: true,
    transparent: false,
    width: document.body.clientWidth - 30,
    height: document.body.clientHeight - 30,
});

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// draw a shape
graphics.beginFill(0xFF3300);
graphics.lineStyle(4, 0xffd900, 1);
graphics.moveTo(50, 350);
graphics.lineTo(250, 350);
graphics.lineTo(100, 400);
graphics.lineTo(50, 350);
graphics.closePath();
graphics.endFill();

// draw polygon
const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

graphics.lineStyle(0);
graphics.beginFill(0x3500FA, 1);
graphics.drawPolygon(path);
graphics.endFill();

app.stage.addChild(graphics);
