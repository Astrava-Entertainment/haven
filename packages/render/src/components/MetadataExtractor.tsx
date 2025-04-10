import { useEffect } from "react";
import { Mesh, Object3D } from "three";
import { setMetadata } from "../store/slices/metadataSlice";
import { useRenderDispatch } from "../store/hooks";
import { HavenMesh, HavenVector3 } from "../common";

interface MetadataExtractorProps {
  model: Object3D | null;
}

function extractUniqueVertex(positions: any): Set<String> {
  const vertices = new Set<String>();

  for (let i = 0; i < positions.length; i += 3) {
    const vertexKey = `${positions[i]},${positions[i + 1]},${positions[i + 2]}`;
    vertices.add(vertexKey);
  }

  return vertices;
}

//TODO:
export default function MetadataExtractor({ model }: MetadataExtractorProps) {
  const dispatch = useRenderDispatch();

  useEffect(() => {
    if (!model) return;

    const vertices: Set<String> = new Set<String>();
    const edges: Set<String> = new Set<String>();
    const faces: number[][] = [];

    model.traverse((child) => {
      if ((child as Mesh).isMesh && (child as Mesh).geometry) {
        const mesh = child as Mesh;
        const positions = mesh.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
          const vertexKey = `${positions[i]},${positions[i + 1]},${
            positions[i + 2]
          }`;
          vertices.add(vertexKey);
        }

        if (mesh.geometry.index) {
          const indices = mesh.geometry.index.array;
          for (let i = 0; i < indices.length; i += 3) {
            const face = [indices[i], indices[i + 1], indices[i + 2]];
            faces.push(face);

            edges.add([indices[i], indices[i + 1]].sort().join("-"));
            edges.add([indices[i + 1], indices[i + 2]].sort().join("-"));
            edges.add([indices[i + 2], indices[i]].sort().join("-"));
          }
        }
      }
    });
    const mesh = new HavenMesh();
    mesh.vertices = vertices.size;
    mesh.edges = edges.size;
    mesh.faces = faces.length;
    dispatch(setMetadata(mesh.toJSON()));
  }, [model, dispatch]);

  return null;
}
