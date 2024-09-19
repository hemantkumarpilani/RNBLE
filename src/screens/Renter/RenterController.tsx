import {
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import RenterView from "./RenterView";
import { goBack } from "../../utils/NavigationUtil";
import showToast from "../../utils/toastmessage";
import { validateEmail } from "../../utils/ValidationUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import BleManager, { BleState } from "react-native-ble-manager";
import UUID from "../../utils/UUID";
import { Buffer } from "buffer";
import {
  checkBiometrics,
  loginWithBiometrics,
} from "../../utils/BiometricUtils";
import { renterDetails } from "../../store/slices/RenterSlice";
import { serialKeyUpdate } from "../../store/slices/SerialKeySlice";
import { showConfirmation } from "../../utils/Alert";

const RenterController = () => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [state, setState] = useState({
    email: "",
    name: "",
    phoneNumber: "",
    serialKey: "",
    renterDetailsFilledShown : true,
    serialKeyHidden : true,
    renterSerialKeyHidden : true
  });
  const [biometricType, setBiometricType] = useState<string | null>();
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const dispatch = useDispatch();

  const { data, masterkey, renterDetailss } = useSelector(
    (state: RootState) => ({
      data: state.devicedetails.data,
      masterkey: state.SerialKey.key,
      renterDetailss: state.renter,
    })
  );

  console.log("dataa", data);
  console.log("serialKeyUpdate", masterkey);

  useEffect(() => {
    console.log("renterDetailsFilled", renterDetailss);
  }, [renterDetailss]);

  const backIconPress = () => {
    goBack();
  };

  const resetPress = async () => {
    console.log("resetPress masterkey", masterkey);
    const buffer1 = Buffer.from("1");
    // console.log("buffer1", buffer1.toJSON().data);
    try {
      const response = await BleManager.write(
        data,
        UUID.ResetMasterCode.serviceUUID,
        UUID.ResetMasterCode.characteristicUUID,
        buffer1.toJSON().data // Data to write (byte array)
      );
      console.log("resetPress reset mastercode response", response);
      dispatch(serialKeyUpdate("123"));
      try {
        const buffer1 = Buffer.from(`${masterkey}00000`);
        const response = await BleManager.write(
          data,
          UUID.CupUnlock.serviceUUID,
          UUID.CupUnlock.characteristicUUID,
          buffer1.toJSON().data // Data to write (byte array)
        );
        console.log("response removePress", response);
          dispatch(
            renterDetails({
              name: "",
              email: "",
              phoneNumber: "",
              renterSerialKey: "",
              filledRenterDetails: false,
            })
          );
          console.log("remove renter response", response);
          setState({
            email: "",
            name: "",
            phoneNumber: "",
            serialKey: "",
          });
          // showToast("Renter has been removed", "success");
      } catch (error) {
        console.log("remove renter error", error);
      }
      showToast('Master code has been reset successfully', 'success')
    } catch (error) {
      console.log("resetPress reset mastercode error", error);
    }
    console.log("RenterController resetPress ");
  };

  const assignPress = () => {
    if (state?.name === "") {
      showToast("Please enter name", "danger");
      return;
    }
    if (!validateEmail(state?.email)?.result) {
      showToast(validateEmail(state?.email)?.msg, "danger");
      return;
    }
    if (state?.phoneNumber === "") {
      showToast("Please enter phone number", "danger");
      return;
    }

    if (state?.phoneNumber?.length !== 10) {
      showToast("Phone number should be 10 digits", "danger");
      return;
    }

    if (state?.serialKey === "") {
      showToast("Please enter serial number", "danger");
      return;
    }
    setRenter();
  };

  const setRenter = async () => {
    const buffer1 = Buffer.from(`${state.serialKey}00000`);
    try {
      const response = await BleManager.write(
        data,
        UUID.SetRenterCode.serviceUUID,
        UUID.SetRenterCode.characteristicUUID,
        buffer1.toJSON().data // Data to write (byte array)
      );
      console.log("response setRenter", response);
      dispatch(
        renterDetails({
          name: state.name,
          email: state.email,
          phoneNumber: state.phoneNumber,
          renterSerialKey: state.serialKey,
          filledRenterDetails: true,
        })
      );
      showToast(`Cup is assigned to ${state.name} successfullly`, "success");
      //   dispatch(renterDetails({
      //     name: state.name,
      //     email:state.email,
      //     phoneNumber:state.phoneNumber,
      //     renterSerialKey: state.serialKey,
      //     filledRenterDetails:true
      // }))
      console.log("setRenter setRenter response", response);
    } catch (error) {
      console.log("setRenter setRenter error", error);
    }
  };

  const handleBiometricVerification = async () => {
    const isVerified = await loginWithBiometrics("123123");
    if (isVerified) {
      setOtpValues(["B", "I", "O", "P"]);
    }
  };

  const unlockMug = async () => {
    console.log("unlockMug",masterkey);
    // checkBiometrics().then((bt)=>{
    //   console.log('checkBiometrics')
    //   handleBiometricVerification()
    //   setBiometricType(bt)
    // }).catch(error=>{
    //   console.log('error error', error)
    // })
    const buffer1 = Buffer.from(`${masterkey}00000`);
    try {
      const response = await BleManager.write(
        data,
        UUID.CupUnlock.serviceUUID,
        UUID.CupUnlock.characteristicUUID,
        buffer1.toJSON().data // Data to write (byte array)
      );
      console.log("unlockMug cup unlock response", response);
    } catch (error) {
      console.log("unlockMug cup unlock error", error);
    }
  };

  const removePress = async () => {
    console.log("removePress");
    showConfirmation(
      "Renter",
      `Do you want to delete this renter 's details permanently`,
      'No',
      "Yes",
      async () => {
        const buffer1 = Buffer.from(`${masterkey}00000`);
        try {
          const response = await BleManager.write(
            data,
            UUID.CupUnlock.serviceUUID,
            UUID.CupUnlock.characteristicUUID,
            buffer1.toJSON().data // Data to write (byte array)
          );
          console.log("response removePress", response);
          dispatch(
            renterDetails({
              name: "",
              email: "",
              phoneNumber: "",
              renterSerialKey: "",
              filledRenterDetails: false,
            })
          );
          console.log("remove renter response", response);
          setState({
            email: "",
            name: "",
            phoneNumber: "",
            serialKey: "",
          });
          showToast("Renter has been removed", "success");
        } catch (error) {
          console.log("setRenter setRenter error", error);
        }
      },
      ()=>{console.log('cancel pressed')}
    );
  };

  const handleChange = (name, value) =>{
    setState(() => ({ ...state, [name]: value }));
  }
    
  return (
    <RenterView
      masterkey={masterkey}
      backIconPress={backIconPress}
      resetPress={resetPress}
      values={state}
      handleChange={handleChange}
      assignPress={assignPress}
      unlockMug={unlockMug}
      renterDetailss={renterDetailss}
      removePress={removePress}
    />
  );
};

export default RenterController;

const styles = StyleSheet.create({});
