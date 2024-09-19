import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export interface DeviceConnect {
    deviceConnect : boolean
}

const initialState : DeviceConnect = {
    deviceConnect : false
}

const deviceConnect = createSlice({
    name : 'deviceConnect',
    initialState,
    reducers : {
        deviceConnectionUpdate : (state : DeviceConnect, action : PayloadAction<boolean>)=>{
            state.deviceConnect = action.payload
        }
    }
})

export const {deviceConnectionUpdate} = deviceConnect.actions
export default deviceConnect.reducer