import {showMessage} from 'react-native-flash-message'

const showToast = (message : string, type :any ) => showMessage(
    {
      message : `${message}`,
      type: type,
      icon : 'auto'
    }
)

export default showToast