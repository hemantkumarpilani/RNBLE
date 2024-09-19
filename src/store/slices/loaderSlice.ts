import { createSlice } from "@reduxjs/toolkit";

export interface LoaderState {
    loading: boolean
}

const initialState = {
    loading: false
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        showLoader: (state: LoaderState) => {
            state.loading = true;
        },
        hideLoader: (state: LoaderState) => {
            state.loading = false;
        },
    },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;