import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EHavenMeshRenderMode } from '../../common';

const initialState: EHavenMeshRenderMode = EHavenMeshRenderMode.solid;

export const controlsSlice = createSlice({
  name: "wireframe",
  initialState,
  reducers: {
    // @ts-ignore
    setNewRenderMode: (_, action: PayloadAction<EHavenMeshRenderMode>) => action.payload,
    // @ts-ignore
    setWireframe: () => EHavenMeshRenderMode.wireframe,
    // @ts-ignore
    setSolid: () => EHavenMeshRenderMode.solid,
  }
});

export const { setNewRenderMode, setWireframe, setSolid } = controlsSlice.actions;
export default controlsSlice.reducer;
