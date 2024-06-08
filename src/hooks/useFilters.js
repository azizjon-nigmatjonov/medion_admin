import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { filterActions } from "../store/filter/filter.slice"

const useFilters = (tableSlug, viewId) => {
  const { state } = useLocation()
  const dispatch = useDispatch()

  const filtersFromLocation = useMemo(() => state ?? {}, [state])
  const filtersFromRedux = useSelector(
    (state) => state.filter.list[tableSlug]?.[viewId] ?? {}
  )

  const clearFilters = useCallback(() => {
    dispatch(filterActions.clearFilters({ tableSlug, viewId }))
  }, [tableSlug, viewId, dispatch])

  const clearOrders = useCallback(() => {
    dispatch(filterActions.clearOrders({ tableSlug, viewId }))
  }, [tableSlug, viewId, dispatch])

  const filterChangeHandler = useCallback(
    (value, name) => {
      dispatch(filterActions.setFilter({ tableSlug, viewId, name, value }))
    },
    [dispatch, tableSlug, viewId]
  )

  const filters = useMemo(() => {
    const filterObject = { ...filtersFromLocation, ...filtersFromRedux }
    return Object.entries(filterObject).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    )
  }, [filtersFromRedux, filtersFromLocation])

  const dataFilters = useMemo(() => {
    const filterObject = { ...filtersFromLocation, ...filtersFromRedux }

    return Object.entries(filterObject)
    .reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})
    // .filter(([key]) => !key.includes("."))
  }, [filtersFromRedux, filtersFromLocation])

  return {
    filters,
    dataFilters,
    clearFilters,
    filterChangeHandler,
    clearOrders,
  }
}

export default useFilters
