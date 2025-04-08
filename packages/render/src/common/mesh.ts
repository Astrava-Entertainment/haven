import {HavenVector3} from "./vector.ts";

export class HavenMesh {
  vertices: number;
  edges: number;
  faces: number;
  rotation: HavenVector3;
  translation: HavenVector3;
  scale: HavenVector3;

  constructor() {
    this.vertices = 0;
    this.edges = 0;
    this.faces = 0;
    this.rotation = HavenVector3.fromVectorZero();
    this.translation = HavenVector3.fromVectorZero();
    this.scale = HavenVector3.fromUnitVector();
  }
}
