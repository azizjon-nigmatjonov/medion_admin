import { createAsyncThunk } from "@reduxjs/toolkit";
import applicationService from "../../services/applicationSercixe";
import { applicationActions } from "./application.slice";

export const fetchApplicationListActions = createAsyncThunk(
  "object/fetchApplicationList",
  async (_, { dispatch }) => {
    dispatch(applicationActions.setLoader(true));
    try {
      const res = await applicationService.getList();
      dispatch(applicationActions.setList(res.apps));
    } catch (error) {
      throw new Error(error);
    } finally {
      dispatch(applicationActions.setLoader(false));
    }
  }
);

export const createApplicationAction = createAsyncThunk(
  "object/createApplication",
  async (data, { dispatch }) => {
    try {
      const res = await applicationService.create(data);

      dispatch(
        applicationActions.add({
          ...data,
          ...res,
        })
      );
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateApplicationAction = createAsyncThunk(
  "object/updateApplication",
  async (data, { dispatch }) => {
    try {
      await applicationService.update(data);

      dispatch(applicationActions.setDataById(data));
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const deleteApplicationAction = createAsyncThunk(
  "object/deleteApplication",
  async (id, { dispatch }) => {
    dispatch(applicationActions.setLoader(true));
    try {
      await applicationService.delete(id);

      dispatch(applicationActions.delete(id));
    } catch (error) {
      throw new Error(error);
    } finally {
      dispatch(applicationActions.setLoader(false));
    }
  }
);
