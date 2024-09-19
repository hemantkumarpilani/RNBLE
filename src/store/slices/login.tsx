import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface LoginState {
    access_token: string
}

const initialState = {
    access_token: ''
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setAccessToken: (state: LoginState, action : PayloadAction<string> ) => {
            state.access_token = action.payload;
        },
    },
});

export const {setAccessToken} = loginSlice.actions;

export default loginSlice.reducer;