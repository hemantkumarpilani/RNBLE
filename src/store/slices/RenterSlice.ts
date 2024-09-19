import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit'


export interface Renter {
    name : string,
    email : string,
    phoneNumber : string,
    renterSerialKey : string,
    filledRenterDetails : boolean,
    renterDeviceConnect : boolean
}

const initialState : Renter = {
    name:"",
    email:"",
    phoneNumber:"",
    renterSerialKey:"",
    filledRenterDetails:false,
    renterDeviceConnect : false
}

const renterSlice = createSlice({
    name:"renter",
    initialState,
    reducers :{
        renterDetails : (state : Renter, action : PayloadAction<any>) =>{
            state.name = action.payload?.name,
            state.email = action.payload?.email,
            state.phoneNumber = action.payload?.phoneNumber,
            state.renterSerialKey = action.payload?.renterSerialKey,
            state.filledRenterDetails = action.payload?.filledRenterDetails
        },
        renterDeviceConnect : (state : Renter, action : PayloadAction<boolean>) =>{
            state.renterDeviceConnect = action.payload
        }

    }
})

export const {renterDetails, renterDeviceConnect} = renterSlice.actions
export default renterSlice.reducer