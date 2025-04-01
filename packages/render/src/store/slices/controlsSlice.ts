import { createSlice } from "@reduxjs/toolkit";
import {EHavenMeshRenderMode} from "../../common";

const initialState = EHavenMeshRenderMode.solid;

// @ts-ignore
export const controlsSlice = createSlice({
  name: "wireframe",
  initialState,
  reducers: {
    setNewRenderMode: (state, action) => {
      state = action.payload;
    },
    // @ts-ignore
    setWireframe: (state) => {
      state = EHavenMeshRenderMode.wireframe;
    },
    // @ts-ignore
    setSolid: (state) => {
      state = EHavenMeshRenderMode.solid;
    },
  }
});

export const { setWireframe, setSolid, setNewRenderMode } = controlsSlice.actions;
export default controlsSlice.reducer;
