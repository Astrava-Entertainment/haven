import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

export class BabylonRenderer {
  private engine: BABYLON.Engine | null = null
  private scene: BABYLON.Scene | null = null
  private canvas: HTMLCanvasElement
  private modelUrl: string

  constructor(canvas: HTMLCanvasElement, path: string, file: string) {
    this.canvas = canvas
    this.modelUrl = path
  }

  async init(): Promise<void> {
    this.engine = new BABYLON.Engine(this.canvas, true)
    this.scene = new BABYLON.Scene(this.engine)

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      5,
      BABYLON.Vector3.Zero(),
      this.scene
    )
    camera.attachControl(this.canvas, true)

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene)
    light.intensity = 0.9

    await BABYLON.SceneLoader.AppendAsync("", this.modelUrl, this.scene)

    this.engine.runRenderLoop(() => {
      if (this.scene) this.scene.render()
    })


    window.addEventListener("resize", () => {
      this.engine?.resize()
    })
  }

  dispose(): void {
    this.engine?.dispose()
    this.scene?.dispose()
  }
}
