import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HavenFile } from '@haven/core/shared';
import '@haven/types';

const initialState: IFileTreeState = {
  tree: [],
};

// Crud stands for Create, Read, Update, Delete operations on the file system
// TODO: please rename this to something more appropriate. FIX?
// Also remember to not mix a slice from one place into an area where it doesn't belong
// Any common file should be in the core/common package, not in the file-system package
const fileTreeSlice = createSlice({
  name: 'fileTree',
  initialState,
  reducers: {
    loadJson(state, action: PayloadAction<HavenFile[]>) {
      state.tree = action.payload;
    }
  },
});

export const { loadJson } = fileTreeSlice.actions;
export default fileTreeSlice.reducer;
