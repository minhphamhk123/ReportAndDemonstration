import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  publicDocs: null,
  privateDocs: null,
};

const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    docLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    docError: (state) => {
      state.loading = false;
      state.error = true;
    },
    docSuccess: (state) => {
      state.loading = false;
      state.error = false;
    },
    docGetPublicDocsSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      console.log("payload public: ", action.payload)
      state.publicDocs = action.payload;
    },
    docGetPrivateDocsSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      console.log("payload private: ", action.payload)
      state.privateDocs = action.payload;
    },
  },
});

export const {
  docLoading,
  docError,
  docSuccess,
  docGetPublicDocsSuccess,
  docGetPrivateDocsSuccess,
} = docsSlice.actions;

export default docsSlice.reducer;