import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: HavenState = {
  tree: [],
};

// Crud stands for Create, Read, Update, Delete operations on the file system
const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    loadJson(state, action: PayloadAction<any>) {
      state.tree = action.payload as HavenFile
    },
  },
});

export const { loadJson } = crudSlice.actions;
export default crudSlice.reducer;
