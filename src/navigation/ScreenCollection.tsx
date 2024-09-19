import ForgotPassword from "../screens/Authentication/ForgotPassword"
import LoginController from "../screens/Authentication/Login/LoginController"
import SignUpController from "../screens/Authentication/SignUp/SignUpController"
import MasterKeyController from "../screens/MasterKey/MasterKeyController"
import QrCodeController from "../screens/QrCode/QrCodeController"
import RenterController from "../screens/Renter/RenterController"
import Renter1Controller from "../screens/Renter1/Renter1Controller"
import SetUpDeviceController from "../screens/SetUpDevice/SetUpDeviceController"
import HomeScreen from "../screens/bluetooth/HomeScreen"


export const authStacks = [
    {
        name:"Login",
        component: LoginController
    },
    {
        name:"ForgotPassword",
        component: ForgotPassword
    },
    {
        name:"SignUp",
        component: SignUpController
    },
    
  
   
]

export const dashboardStack = [
    {
        name :'HomeScreen',
        component: HomeScreen
    },
    {
        name :'SetUpDevice',
        component: SetUpDeviceController
    },
    {
        name :'Renter',
        component: RenterController
    },
     {
        name :'QrCode',
        component: QrCodeController
    },
    {
        name :'RenterScreen',
        component: Renter1Controller
    },
    {
        name :'MasterKey',
        component: MasterKeyController
    },

    
]

export const mergedStacks = [...dashboardStack, ...authStacks]