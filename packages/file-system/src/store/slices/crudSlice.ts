import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HavenFile } from '@haven/core/shared';

const initialState: HavenState = {
  tree: [],
};

// Crud stands for Create, Read, Update, Delete operations on the file system
// TODO: please rename this to something more appropriate
// Also remember to not mix a slice from one place into an area where it doesn't belong
// Any common file should be in the core/common package, not in the file-system package
const crudSlice = createSlice({
  name: 'crud',
  initialState,
  reducers: {
    loadJson(state, action: PayloadAction<any>) {
      state.tree = action.payload as HavenFile;
    },
  },
});

export const { loadJson } = crudSlice.actions;
export default crudSlice.reducer;
