import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EHavenMeshRenderMode, HavenVector3 } from '../../common';

interface ModelReducer {
  renderMode: EHavenMeshRenderMode
  modelData: { position: HavenVector3, rotation: HavenVector3, scale: HavenVector3 } | null;
}

const initialState: ModelReducer = {
  renderMode: EHavenMeshRenderMode.solid,
  modelData: null
}

export const controlsSlice = createSlice({
  name: "control",
  initialState,
  reducers: {
    setModelData: (state, action: PayloadAction<{ position: HavenVector3, rotation: HavenVector3, scale: HavenVector3 }>) => {
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
