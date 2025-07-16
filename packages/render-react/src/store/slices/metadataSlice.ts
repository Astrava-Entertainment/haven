import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of your Redux slice state
interface MetadataReducer {
  data: HavenMeshSerialized | null;
}

// Initial state using serialized types
const initialState: MetadataReducer = {
  data: null
};

// Create the slice
export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<HavenMeshSerialized | null>) => {
      state.data = action.payload;
    },
    setTranslation: (state, action: PayloadAction<Vector3Serialized>) => {
      if (state.data) {
        state.data.translation = action.payload;
      }
    },
    setRotation: (state, action: PayloadAction<Vector3Serialized>) => {
      if (state.data) {
        state.data.rotation = action.payload;
      }
    },
    setScale: (state, action: PayloadAction<Vector3Serialized>) => {
      if (state.data) {
        state.data.scale = action.payload;
      }
    },
  },
});

// Export actions and reducer
export const { setMetadata, setTranslation, setRotation, setScale } = metadataSlice.actions;
export default metadataSlice.reducer;
