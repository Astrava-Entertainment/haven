import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HavenFile } from '../../../common/file';

const initialState: HavenFile[] = [];

class myClass {
  public name: string;

  constructor() {
    console.log('hello');
    this.name = 'world';
  }

}

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<HavenFile>) => {
      const hello = new myClass();
      console.log(hello);
      console.log('hello');

      state.push(action.payload);
    }
  }
});

export const { addFile } = fileSlice.actions;
export default fileSlice.reducer;
