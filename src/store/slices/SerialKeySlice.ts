import { createSlice, PayloadAction } from "@reduxjs/toolkit"


export interface SerialKey  {
    key :string,
    cupNmae : string,
}


const initialState : SerialKey ={
    key:'123',
    cupNmae:""
}

const serialKeySlice = createSlice({
    name:"serial",
    initialState,
    reducers :{
        serialKeyUpdate : (state : SerialKey, action : PayloadAction<string>) =>{
            state.key = action.payload
        },
        cupName : (state : SerialKey, action : PayloadAction<string>) =>{
            state.cupNmae = action.payload
        },
    }
})

export const {serialKeyUpdate, cupName} = serialKeySlice.actions
export default serialKeySlice.reducer