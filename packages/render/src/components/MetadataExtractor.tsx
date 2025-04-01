import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Mesh, Object3D, Vector3 } from "three";
import { setMetadata } from "../features/metadataReducer";

interface MetadataExtractorProps {
  model: Object3D | null;
}

export default function MetadataExtractor({ model }: MetadataExtractorProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!model) return;

    const vertices: Set<string> = new Set();
    const edges: Set<string> = new Set();
    const faces: number[][] = [];

    model.traverse((child) => {
      if ((child as Mesh).isMesh && (child as Mesh).geometry) {
        const mesh = child as Mesh;
        const positions = mesh.geometry.attributes.position.array;

        // Extraer vértices únicos
        for (let i = 0; i < positions.length; i += 3) {
          const vertexKey = `${positions[i]},${positions[i + 1]},${
            positions[i + 2]
          }`;
          vertices.add(vertexKey);
        }

        // Extraer caras y aristas
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

    // Dispatch para actualizar Redux con los conteos
    dispatch(
      setMetadata({
        vertices: vertices.size,
        edges: edges.size,
        faces: faces.length,
      })
    );
  }, [model, dispatch]);

  return null; // No renderiza nada, solo actualiza Redux
}
