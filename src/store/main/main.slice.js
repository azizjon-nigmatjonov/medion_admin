import { createSlice } from "@reduxjs/toolkit"

export const { actions: mainActions, reducer: mainReducer } =
  createSlice({
    name: "tableColumn",
    initialState: {
      settingsSidebarIsOpen: true
    },
    reducers: {
      setSettingsSidebarIsOpen: (state, { payload }) => {
        state.settingsSidebarIsOpen = payload
      }
    },
  })
