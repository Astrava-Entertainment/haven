import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vector3 } from 'three';

interface GizmoReducer {
  rotation: Vector3 | null;
}

const initialState: GizmoReducer = {
  rotation: new Vector3(0, 0, 0)
};

export const gizmoSlice = createSlice({
  name: 'gizmo',
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<Vector3>) => {
      state.rotation = action.payload;
    }
  }
});

export const { setRotation } = gizmoSlice.actions;
export default gizmoSlice.reducer;
