import axios from "axios";
import { store } from "../store/index";
import { showAlert } from "../store/alert/alert.thunk";
import authService from "../services/auth/authService";
import { authActions } from "../store/auth/auth.slice";
export const baseURL = import.meta.env.VITE_BASE_URL;

const request = axios.create({
  baseURL,
  timeout: 100000,
});

// const errorHandler = (error, hooks) => {

//   if(error.response?.data?.data) store.dispatch(showAlert(error.response.data.data))
//   else store.dispatch(showAlert('___ERROR___'))

//   return Promise.reject(error.response)
// }

const errorHandler = (error, hooks) => {
  const token = store.getState().auth.token;
  // const logoutParams = {
  //   access_token: token,
  // };

  if (error?.response?.status === 401) {
    const refreshToken = store.getState().auth.refreshToken;

    const params = {
      refresh_token: refreshToken,
    };

    const originalRequest = error.config;

    return authService
      .refreshToken(params)
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        store.dispatch(authActions.setPermission(res));
        return request(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(error);
      });
  } else {
    if (error?.response) {
      if (error.response?.data?.data) {
        if (
          error.response.data.data !==
          "rpc error: code = Internal desc = member group is required to add new member"
        ) {
          store.dispatch(showAlert(error.response.data.data));
        }
      }
      if (error?.response?.status === 403) {
        store.dispatch(authActions.logout());
        // store.dispatch(logoutAction(logoutParams)).unwrap().catch()
      }
    } else store.dispatch(showAlert("___ERROR___"));

    return Promise.reject(error.response);
  }
};

request.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => errorHandler(error)
);

request.interceptors.response.use(
  (response) => response.data.data,
  errorHandler
);

export default request;
