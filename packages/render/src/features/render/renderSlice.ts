import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadState {
  data: any | []; // Define mejor el tipo según lo que almacene el estado
}

const initialState: UploadState = {
  data: [],
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {

  },
});

// export const { setUploadData, clearUploadData } = uploadSlice.actions;
export default uploadSlice.reducer;
