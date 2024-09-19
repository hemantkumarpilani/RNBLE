import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { goBack, navigate } from "../../../utils/NavigationUtil";
import {
  PasswordMatch,
  validateConfirmPasswordEntry,
  validateEmail,
  validateName,
  validatePasswordEntry,
} from "../../../utils/ValidationUtils";
import showToast from "../../../utils/toastmessage";
import { register } from "../../../api";
import SignUpView from "./SignUpView";

const SignUpController = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    focused1 : false,
    focused2 : false,
    focused3 : false,
    focused4 : false,
  });

  const textInputRef1 = useRef()
  const textInputRef2 = useRef()
  const textInputRef3 = useRef()
  const textInputRef4 = useRef()

  const handleChange = (name, value) => {
    setState(() => ({ ...state, [name]: value }));
  };
  const backIconPress = () => {
    goBack();
  };

  const buttonPress = async () => {
    const passwordRule = true
    if (!validateName(state?.name).result) {
      showToast(validateName(state?.name).msg, "danger");
      return;
    } else if (!validateEmail(state?.email)?.result) {
      showToast(validateEmail(state?.email)?.msg, "danger");
      return;
    } else if (!validatePasswordEntry(state?.password, state?.email, passwordRule).result) {
      showToast(
        validatePasswordEntry(state?.password, state?.email, passwordRule).msg,
        "danger"
      );
      return;
    } else if (
      !validateConfirmPasswordEntry(state?.confirmPassword, state?.email).result
    ) {
      showToast(
        validateConfirmPasswordEntry(state?.confirmPassword, state?.email).msg,
        "danger"
      );
      return;
    } else if (!PasswordMatch(state?.password, state?.confirmPassword).result) {
      showToast(
        PasswordMatch(state?.password, state?.confirmPassword).msg,
        "danger"
      );
      return;
    }

    const response = await register(state?.name, state?.email, state?.password);
    if (response?.status == 200) {
      showToast(response?.message, "success");
      navigate("Login");
    } else {
      showToast(response?.data?.message, "danger");
    }
  };

  const onFocus1 = ()=>{
    // return true
    console.log('onFocus')
    setState(()=>({...state, focused1 : true}))
  }

  const onFocus2 = ()=>{
    setState(()=>({...state, focused2 : true}))
  }

  const onFocus3 = ()=>{
    setState(()=>({...state, focused3 : true}))
  }

  const onFocus4 = ()=>{
    setState(()=>({...state, focused4 : true}))
  }

  const onBlur1 = ()=>{
    setState(()=>({...state, focused1 : false}))
  }

  const onBlur2 = ()=>{
    setState(()=>({...state, focused2 : false}))
  }

  const onBlur3 = ()=>{
    setState(()=>({...state, focused3 : false}))
  }

  const onBlur4 = ()=>{
    setState(()=>({...state, focused4 : false}))
  }
  return (
    <SignUpView
      values={state}
      handleChange={handleChange}
      buttonPress={buttonPress}
      backIconPress={backIconPress}
      textInputRef1={textInputRef1}
      textInputRef2={textInputRef2}
      textInputRef3={textInputRef3}
      textInputRef4={textInputRef4}
      onFocus1={onFocus1}
      onFocus2={onFocus2}
      onFocus3={onFocus3}
      onFocus4={onFocus4}
      onBlur1={onBlur1}
      onBlur2={onBlur2}
      onBlur3={onBlur3}
      onBlur4={onBlur4}
    />
  );
};

export default SignUpController;

const styles = StyleSheet.create({});
