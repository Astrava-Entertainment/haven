import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WireframeState {
  value: boolean;
}

const initialState: WireframeState = {
  value: false
};

export const wireframeSlice = createSlice({
  name: "wireframe",
  initialState,
  reducers: {
    setWireframe: (state, action: PayloadAction<WireframeState>) => {
      state.value = action.payload.value;
    }
  }
});

export const { setWireframe } = wireframeSlice.actions;
export default wireframeSlice.reducer;
