import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import LoginView from "./LoginView";
import { useDispatch, useSelector } from "react-redux";
import { navigate, resetAndNavigate } from "../../../utils/NavigationUtil";
import {
  validateEmail,
  validatePasswordEntry,
} from "../../../utils/ValidationUtils";
import showToast from "../../../utils/toastmessage";
import { login } from "../../../api";
import { setAccessToken } from "../../../store/slices/login";
import { RootState } from "../../../store/reducers";
import BleManager, { BleState } from "react-native-ble-manager";
import { showConfirmation } from "../../../utils/Alert";
import { renterDeviceConnect } from "../../../store/slices/RenterSlice";

const LoginController = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    focused1: false,
    focused2: false,
  });
  const [qrCode, setQrCode] = useState(false);
  const textInputRef1 = useRef();
  const textInputRef2 = useRef();

  const dispatch = useDispatch();

  const { renterDeviceConnection, deviceIp } = useSelector(
    (state: RootState) => ({
      renterDeviceConnection: state.renter.renterDeviceConnect,
      deviceIp: state.devicedetails.data,
    })
  );

  const handleChange = (name, value) => {
    setState(() => ({ ...state, [name]: value }));
  };

  const textPress = () => {
    navigate("ForgotPassword");
  };

  const onFocus1 = () => {
    setState(() => ({ ...state, focused1: true }));
  };

  const onFocus2 = () => {
    setState(() => ({ ...state, focused2: true }));
  };

  const onBlur1 = () => {
    setState(() => ({ ...state, focused1: false }));
  };

  const onBlur2 = () => {
    setState(() => ({ ...state, focused2: false }));
  };

  const buttonPress = async (text) => {
    if (text === "Sign in") {
      if (!validateEmail(state?.email)?.result) {
        showToast(validateEmail(state?.email)?.msg, "danger");
        return;
      } else if (!validatePasswordEntry(state?.password, state?.email).result) {
        showToast(
          validatePasswordEntry(state?.password, state?.email).msg,
          "danger"
        );
        return;
      }
      const response = await login(state?.email, state?.password);
      //  navigate('HomeScreen')
      if (response?.status == 200) {
        setState({
          email: "",
          password: "",
          focused1: false,
          focused2: false,
        });
        showToast(response?.message, "success");
        dispatch(setAccessToken(response?.data?.access_token));
        resetAndNavigate("HomeScreen");
      } else {
        showToast(response?.data?.message, "danger");
      }
    } else if (text === "Sign up") {
      console.log("text", text);
      navigate("SignUp");
    } else {
      if (renterDeviceConnection) {
        showConfirmation(
          "Add New Cup",
          "Adding this cup will disconnect this app from any previously scanned cup",
          "CANCEL",
          "ADD",
          () => {
            BleManager.disconnect(deviceIp)
              .then((deviceDisconnect) => {
                console.log("deviceDisconnect", deviceIp);
                console.log("disconnected");
                dispatch(renterDeviceConnect(false));
                navigate("QrCode");
              })
              .catch((error) => {
                console.log("onDisconnect error", error);
              });
          },
          ()=>{
            navigate('RenterScreen')
          }
        );
      } else {
        navigate("QrCode");
      }
    }
  };
  return (
    <LoginView
      values={state}
      handleChange={handleChange}
      buttonPress={buttonPress}
      textPress={textPress}
      textInputRef1={textInputRef1}
      textInputRef2={textInputRef2}
      onFocus1={onFocus1}
      onFocus2={onFocus2}
      onBlur1={onBlur1}
      onBlur2={onBlur2}
    />
  );
};

export default LoginController;

const styles = StyleSheet.create({});
