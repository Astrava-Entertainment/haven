import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HavenVector3 } from "../../common";

interface GizmoSlice {
  rotation: HavenVector3;
}
const initialState: GizmoSlice = {
  rotation: new HavenVector3(0, 0, 0)
};


export const gizmoSlice = createSlice({
  name: "gizmo",
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<HavenVector3>) => {
      const { x, y, z } = action.payload; // new rotation values

      if (state.rotation.x !== x || state.rotation.y !== y || state.rotation.z !== z) {
        state.rotation = new HavenVector3(x, y, z);
      }
    }
  }
});

export const { setRotation } = gizmoSlice.actions;
export default gizmoSlice.reducer;
