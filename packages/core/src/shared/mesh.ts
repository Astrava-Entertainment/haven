import { HavenVector3 } from "./vector.ts";

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

  static fromObject(obj: {
    vertices: number;
    edges: number;
    faces: number;
    rotation: { x: number; y: number; z: number };
    translation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  }): HavenMesh {
    const mesh = new HavenMesh();
    mesh.vertices = obj.vertices;
    mesh.edges = obj.edges;
    mesh.faces = obj.faces;
    mesh.rotation = HavenVector3.fromJSON(obj.rotation);
    mesh.translation = HavenVector3.fromJSON(obj.translation);
    mesh.scale = HavenVector3.fromJSON(obj.scale);
    return mesh;
  }

  toJSON() {
    return {
      vertices: this.vertices,
      edges: this.edges,
      faces: this.faces,
      rotation: this.rotation.toJSON(),
      translation: this.translation.toJSON(),
      scale: this.scale.toJSON(),
    };
  }
}
