import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EHavenMeshRenderMode } from '../../common';

interface ModelReducer {
  renderMode: EHavenMeshRenderMode
  modelData: { position: { x: number, y: number, z: number }, rotation: { x: number, y: number, z: number }, scale: { x: number, y: number, z: number } } | null;
}

const initialState: ModelReducer = {
  renderMode: EHavenMeshRenderMode.solid,
  modelData: null
}

export const controlsSlice = createSlice({
  name: "control",
  initialState,
  reducers: {
    setModelData: (state, action: PayloadAction<{ position: { x: number, y: number, z: number }, rotation: { x: number, y: number, z: number }, scale: { x: number, y: number, z: number } } | null>) => {
      state.modelData = action.payload;
    },
    // @ts-ignore
    setNewRenderMode: (_, action: PayloadAction<EHavenMeshRenderMode>) => action.payload,
    // @ts-ignore
    setWireframe: (state, _) => {
      state.renderMode = EHavenMeshRenderMode.wireframe
    },
    // @ts-ignore
    setSolid: (state, _) => {
      state.renderMode = EHavenMeshRenderMode.solid
    },
  }
});

export const { setModelData, setNewRenderMode, setWireframe, setSolid } = controlsSlice.actions;
export default controlsSlice.reducer;
