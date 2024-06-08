import { createSlice } from "@reduxjs/toolkit"

export const { actions: groupFieldActions, reducer: groupFieldReducer } =
  createSlice({
    name: "groupField",
    initialState: {
      list: {},
    },
    reducers: {
      setList: (state, { payload: { tableSlug, field } }) => {
        
      },
    },
    // extraReducers: {
    //   [fetchConstructorTableListAction.fulfilled]: (state, { payload }) => {
    //     state.list = payload ?? []
    //   }
    // }
  })
