import ReactNativeBiometrics from "react-native-biometrics";

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometrics = async () => {
  try {
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    // console.log('checkBiometrics biometryType', biometryType)
    return biometryType;
  } catch (error) {
    console.log("checkBiometrics error", error);
    return null;
  }
};

export const generateBiometricPublicKey = async () => {
  try {
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    if (keysExist) {
      throw new Error("Biometric Key exists");
    }
    const { publicKey } = await rnBiometrics.createKeys();
    // console.log("publicKey send this to server",publicKey );
  } catch (error) {
    console.log("generateBiometricPublicKey error", error);
  }
};

export const deleteBiometricPublicKey = async () => {
  try {
    const { keysDeleted } = await rnBiometrics.deleteKeys();
    if (!keysDeleted) {
      throw new Error("Can not remove biometrics");
    }
    // console.log("keys deleted", keysDeleted);
  } catch (error) {
    console.log("deleteBiometricPublicKey error", error);
  }
};

export const loginWithBiometrics = async (userID: string) => {
  try {
    const isBiometricAvailable = await checkBiometrics();
    if (!isBiometricAvailable) {
      throw new Error("Biometric not available");
    }

    const { keysExist } = await rnBiometrics.biometricKeysExist();

    if (!keysExist) {
      const { publicKey } = await rnBiometrics.createKeys();
      // console.log("loginWithBiometrics publicKey", publicKey);
    }
    const { publicKey } = await rnBiometrics.createKeys();
      // console.log("loginWithBiometrics publicKey", publicKey);

    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: "Sign in",
      payload: userID,
    });

    if (!success) {
      throw new Error("Biometrics authentication failed");
    }

    // console.log("loginWithBiometrics signature", signature);

    if (signature) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("loginWithBiometrics error", JSON.stringify(error));
  }
};

export default {
  checkBiometrics,
  loginWithBiometrics,
  deleteBiometricPublicKey,
  generateBiometricPublicKey,
};
