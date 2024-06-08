import { createSlice } from "@reduxjs/toolkit"

export const { actions: filterActions, reducer: filterReducer } = createSlice({
  name: "filter",
  initialState: {
    list: {},
    new_list: {},
  },
  reducers: {
    setFilter: (state, { payload: { tableSlug, viewId, name, value } }) => {
      if (!state.list[tableSlug]) state.list[tableSlug] = {}
      if (!state.list[tableSlug][viewId]) state.list[tableSlug][viewId] = {}
      state.list[tableSlug][viewId][name] = value
    },
    removeFromList: (state, { payload: { tableSlug, viewId, name } }) => {
      delete state.list[tableSlug][viewId][name]
    },
    setNewFilter: (state, { payload: { tableSlug, fieldId, checked } }) => {
      if (!state.new_list[tableSlug]?.find((i) => i.id === fieldId)) {
        state.new_list[tableSlug] = state.new_list?.[tableSlug]
          ? [...state.new_list?.[tableSlug], { id: fieldId, checked }]
          : [{ id: fieldId, checked }]
      } else {
        state.new_list[tableSlug] = state.new_list[tableSlug]?.map((i) => {
          if (i.id === fieldId) {
            return {
              id: fieldId,
              checked,
            }
          } else {
            return i
          }
        })
      }
    },
    clearNewFilter: (state, { payload: { tableSlug, fieldId } }) => {
      state.new_list[tableSlug] = state.new_list[tableSlug]?.filter(
        (i) => i.id !== fieldId
      )
    },
    clearFilters: (state, { payload: { tableSlug, viewId } }) => {
      if (state.list[tableSlug]?.[viewId]?.order) {
        state.list[tableSlug][viewId] = {
          order: state.list[tableSlug][viewId].order,
        }
      } else {
        state.list[tableSlug][viewId] = {}
      }
    },
    clearOrders: (state, { payload: { tableSlug, viewId } }) => {
      state.list[tableSlug][viewId].order = {}
    },
  },
})
