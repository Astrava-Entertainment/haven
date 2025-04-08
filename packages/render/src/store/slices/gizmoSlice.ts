import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// TODO: Replace this object to HavenVector3
// it has an error "non-serializable"

interface GizmoSlice {
  rotation: { x: number; y: number; z: number };
}

const initialState: GizmoSlice = {
  rotation: { x: 0, y: 0, z: 0 }
};

export const gizmoSlice = createSlice({
  name: "gizmo",
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
      const { x, y, z } = action.payload;

      if (state.rotation.x !== x || state.rotation.y !== y || state.rotation.z !== z) {
        state.rotation = { x, y, z }
      }
    }
  }
});

export const { setRotation } = gizmoSlice.actions;
export default gizmoSlice.reducer;
