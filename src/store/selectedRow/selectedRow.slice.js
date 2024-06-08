import { createSlice } from "@reduxjs/toolkit";

export const { actions: selectedRowActions, reducer: selectedRowReducer } =
  createSlice({
    name: "selectedRow",
    initialState: {
      selected: [],
    },
    reducers: {
      addRowId: (state, action) => {
        if (Array.isArray(action.payload)) {
          state.selected.push(...action.payload);
        } else {
          state.selected.push(action.payload);
        }
      },
      removeRowId: (state, action) => {
        state.selected = state.selected.filter(
          (guid) => guid !== action.payload
        );
      },
      clear: (state, action) => {
        state.selected = [];
      },
    },
  });
