import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export interface DeviceDetails {
    data : string
}

const initialState : DeviceDetails = {
    data :''
}

const DeviceDetails = createSlice({
    name:'DeviceDetails',
    initialState,
    reducers :{
        DeviceDetailsSlice : (state : DeviceDetails, action : PayloadAction<string>)=>{
            state.data = action.payload
        }
    }
})

export const {DeviceDetailsSlice} = DeviceDetails.actions
export default DeviceDetails.reducer