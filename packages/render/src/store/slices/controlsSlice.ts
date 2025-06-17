import { HavenVector3 } from "@haven/core/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "@haven/types";

interface ModelReducer {
  renderMode: EHavenMeshRenderMode
  modelData: { position: HavenVector3, rotation: HavenVector3, scale: HavenVector3 } | null;
}

const initialState: ModelReducer = {
  renderMode: "solid",
  modelData: null
}

export const controlsSlice = createSlice({
  name: "control",
  initialState,
  reducers: {
    setModelData: (state, action: PayloadAction<{ position: HavenVector3, rotation: HavenVector3, scale: HavenVector3 }>) => {
      state.modelData = action.payload;
    },
    setNewRenderMode: (_, action: PayloadAction<EHavenMeshRenderMode>) => action.payload,
    setWireframe: (state, _) => {
      state.renderMode = EHavenMeshRenderMode.wireframe
    },
    setSolid: (state, _) => {
      state.renderMode = EHavenMeshRenderMode.solid
    },
  }
});

export const { setModelData, setNewRenderMode, setWireframe, setSolid } = controlsSlice.actions;
export default controlsSlice.reducer;
