import  login, { LoginState } from './../slices/login';
import LoaderSlice, { LoaderState } from '../slices/loaderSlice';
import SerialKeySlice, { SerialKey } from '../slices/SerialKeySlice';
import DeviceDetailsSlice, { DeviceDetails } from '../slices/DeviceDetails';
import RenterSlice, { Renter } from '../slices/RenterSlice';
import { combineReducers } from 'redux';
import storage from '@react-native-async-storage/async-storage'
import { persistReducer } from 'redux-persist';
import DeviceConnectSlice, { DeviceConnect } from '../slices/DeviceConnectSlice';

export interface RootState {
    devicedetails : DeviceDetails,
    renter : Renter,
    SerialKey : SerialKey,
    loader : LoaderState,
    login : LoginState,
    deviceConnection : DeviceConnect
}

const persistConfig = {
    key : 'root',
    storage,
    blacklist: ['loader']

}

const rootReducer = combineReducers({
    devicedetails : DeviceDetailsSlice,
    renter : RenterSlice,
    SerialKey : SerialKeySlice,
    loader: LoaderSlice,
    login : login,
    deviceConnection : DeviceConnectSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default persistedReducer