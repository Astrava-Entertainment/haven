import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RotationState {
  x: number;
  y: number;
  z: number;
}

interface GizmoReducer {
  rotation: RotationState;
}

const initialState: GizmoReducer = {
  rotation: { x: 0, y: 0, z: 0 }
};

export const gizmoSlice = createSlice({
  name: "gizmo",
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<RotationState>) => {
      const { x, y, z } = action.payload;
      if (state.rotation.x !== x || state.rotation.y !== y || state.rotation.z !== z) {
        state.rotation = { x, y, z };
      }
    }
  }
});

export const { setRotation } = gizmoSlice.actions;
export default gizmoSlice.reducer;
