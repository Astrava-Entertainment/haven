import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {HavenMesh} from "../../common";

const initialState: HavenMesh = new HavenMesh();

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<HavenMesh>) => {
      state.vertices = action.payload.vertices;
      state.edges = action.payload.edges;
      state.faces = action.payload.faces;
    },
  },
});

export const { setMetadata } = metadataSlice.actions;
export default metadataSlice.reducer;
