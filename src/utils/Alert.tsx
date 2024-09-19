import { Alert } from "react-native";

export const showConfirmation = (title: string, msg: string, text1, text2, okPress: Function, cancelPress : Function) => {
    Alert.alert(
        title,
        msg,
        [
            {
                text: text1,
                onPress: () => cancelPress(),
                style: 'cancel',
            },
            {
                text: text2,
                onPress: () => okPress(),
            },
        ],
        { cancelable: false }
    );
};