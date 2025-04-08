import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {HavenMesh} from "../../common";

// Definir Translation como un array de 3 números
type Translation = [number, number, number];

interface MetadataState {
  vertices: number;
  edges: number;
  faces: number;
  translation: Translation;
}

const initialState: MetadataState = {
  vertices: 0,
  edges: 0,
  faces: 0,
  translation: [0, 0, 0], // Ahora es un array
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<HavenMesh>) => {
      state.vertices = action.payload.vertices;
      state.edges = action.payload.edges;
      state.faces = action.payload.faces;
      state.translation = action.payload.translation;
    },
    setTranslation: (state, action: PayloadAction<Translation>) => {
      state.translation = action.payload;
    },
  },
});

export const { setMetadata, setTranslation } = metadataSlice.actions;
export default metadataSlice.reducer;
