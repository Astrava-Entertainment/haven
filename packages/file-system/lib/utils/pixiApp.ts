import { Application, Assets, Container, Sprite } from "pixi.js";

export class PixiApp {
  constructor(domElement) {
    this.domElement = domElement;
    this.app = null;
    this.container = null;
  }

  async init() {
    this.app = new Application();
    await this.app.init({ background: "#1099bb", resizeTo: this.domElement });

    this.domElement.appendChild(this.app.canvas);

    this.container = new Container();
    this.app.stage.addChild(this.container);

  }

  async loadGrid(assetUrl) {
    if (!this.container) return;

    this.container.removeChildren();

    // Load texture
    const texture = await Assets.load(assetUrl);

    // Create sprite
    const sprite = new Sprite(texture);

    // Scale if grid is larger than screen
    const scaleX = this.app.screen.width / sprite.width;
    const scaleY = this.app.screen.height / sprite.height;
    const scale = Math.min(scaleX, scaleY, 1);
    sprite.scale.set(scale);

    this.container.addChild(sprite);

    // Center container on screen
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
      this.container = null;
    }
  }
}
