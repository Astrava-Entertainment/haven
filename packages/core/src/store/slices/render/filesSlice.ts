import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HavenFile } from '../../../common/file';

interface FilesReducer {
  files: HavenFile[];
}

const initialState: FilesReducer = {
  files: []
};

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<HavenFile>) => {
      state.files.push(action.payload);
    }
  }
});

export const { addFile } = fileSlice.actions;
export default fileSlice.reducer;
