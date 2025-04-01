import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MetadataState {
  vertices: number;
  edges: number;
  faces: number;
}

const initialState: MetadataState = {
  vertices: 0,
  edges: 0,
  faces: 0,
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<MetadataState>) => {
      state.vertices = action.payload.vertices;
      state.edges = action.payload.edges;
      state.faces = action.payload.faces;
    },
  },
});

export const { setMetadata } = metadataSlice.actions;
export default metadataSlice.reducer;
