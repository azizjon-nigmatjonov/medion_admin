import { createSlice } from "@reduxjs/toolkit"

export const {
  actions: tabRouterActions,
  reducer: tabRouterReducer
} = createSlice({
  name: "tabRouter",
  initialState: {
    tabs: [],
  },
  reducers: {
    addTab: (state, action) => {
      state.tabs.push(action.payload)
    },
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter(tab => tab.link !== action.payload)
    },
    clear: (state, action) => {
      state.tabs = []
    }
  },
})