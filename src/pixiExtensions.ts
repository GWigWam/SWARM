import { Drawable, Graphic } from "./drawing";
import { Graphics, Point } from "pixi.js";

declare module 'pixi.js' {
    export interface Graphics {
        drawGraphic(graphic: Graphic): void;
        drawDrawable(drawable: Drawable): void;
    }
}

Graphics.prototype.drawGraphic = function(graphic) {
    this.beginFill(graphic.color);
    this.drawPolygon(graphic.shape.map(p => new Point(p.x, p.y)));
    this.endFill();
}

Graphics.prototype.drawDrawable = function(drawable) {
    drawable.getGraphics().forEach(g => this.drawGraphic(g));
}

export { Graphics };
