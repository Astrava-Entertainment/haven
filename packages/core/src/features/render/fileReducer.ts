import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileReducer {
  file: { name: string; type: string; size: number } | null;
}

const initialState: FileReducer = {
  file: null
};

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<{ name: string; type: string; size: number }>) => {
      state.file = action.payload;
    }
  }
});

export const { setFile } = fileSlice.actions;
export default fileSlice.reducer;
