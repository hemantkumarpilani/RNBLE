import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../store/slices/login";
import { store } from "../store";
const BASE_URL = "http://44.194.24.171/development/api";


const login = async (email: string, password: string) => {
  try {
    console.log("login", email, password);
    const response = await Axios.post(`${BASE_URL}/login`, {
      email: email,
      password: password,
    });
    console.log("login response", response.data);
    // await AsyncStorage.setItem(
    //   "access-token",
    //   response.data?.data?.access_token
    // );
    return response.data;
  } catch (error) {
    console.log("login error", JSON.stringify(error?.response));
    return error?.response;
    // console.log('login error', error?.response)
  }
};

const forgotPassword = async (email: string) => {
  try {
    const response = await Axios.post(`${BASE_URL}/forgot-password`, {
      email: email,
    });
    console.log("login forgotPassword", response.data);
    return response.data;
  } catch (error) {
    console.log("forgotPassword error", JSON.stringify(error?.response));
    return error?.response;
  }
};

const logout = async () => {
  try {
    const access_token = store.getState().login.access_token
    const response = await Axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("logout response", response.data);
    return response?.data;
  } catch (error) {
    // console.log('login error',JSON.stringify( error?.response))
    console.log("logout error", JSON.stringify(error?.response));
  }
};

const register = async (name: string, email: string, password: string) => {
  try {
    const response = await Axios.post(`${BASE_URL}/register`, {
      name: name,
      email: email,
      password: password,
    });
    console.log("register response", response.data);
    return response.data;
    // const access_token = await AsyncStorage.getItem("access-token")
    // console.log('access_token', access_token)
  } catch (error) {
    // console.log('login error',JSON.stringify( error?.response))
    console.log("register error", JSON.stringify(error?.response));
    return error?.response;
  }
};

export { login, forgotPassword, logout, register };
