import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HavenVector3 } from '@haven/core/shared';

interface GizmoReducer {
  rotation: { x: number; y: number; z: number };
}

const initialState: GizmoReducer = {
  rotation: HavenVector3.fromVectorZero().toJSON()
};

export const gizmoSlice = createSlice({
  name: 'gizmo',
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
      const { x, y, z } = action.payload;
      if (state.rotation.x !== x || state.rotation.y !== y || state.rotation.z !== z) {
        state.rotation = { x, y, z }; // Still storing plain object
      }
    }
  }
});

export const { setRotation } = gizmoSlice.actions;
export default gizmoSlice.reducer;
