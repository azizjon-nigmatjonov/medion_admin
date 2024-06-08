import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import { cashboxActions } from "../cashbox/cashbox.slice";
import { authActions } from "./auth.slice";



export const loginAction = createAsyncThunk(
  'auth/login',
  async ({ data, cashboxData }, { dispatch }) => {

    try {
      const res = await authService.login(data)
      dispatch(cashboxActions.setData(cashboxData))
      return res
    } catch (error) {
      throw new Error(error)
      // dispatch(showAlert('Username or password is incorrect'))
    }

  }
)