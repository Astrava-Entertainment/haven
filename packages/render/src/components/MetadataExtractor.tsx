import { useEffect } from "react";
import { Mesh, Object3D } from "three";
import { setMetadata } from "../store/slices/metadataSlice";
import { useRenderDispatch } from "../store/hooks";

interface MetadataExtractorProps {
  model: Object3D | null;
}

export default function MetadataExtractor({ model }: MetadataExtractorProps) {
  const dispatch = useRenderDispatch();

  useEffect(() => {
    if (!model) return;

    const vertices: Set<string> = new Set();
    const edges: Set<string> = new Set();
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

    dispatch(
      setMetadata({
        vertices: vertices.size,
        edges: edges.size,
        faces: faces.length,
        translation: [0, 0, 0],
      })
    );
  }, [model, dispatch]);

  return null;
}
