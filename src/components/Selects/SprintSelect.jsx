import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sprintActions } from "../../redux/slices/sprint.slice"
import CSelect from "../CSelect"

const SprintSelect = ({value, onChange}) => {
  const dispatch = useDispatch()

  const sprintsList = useSelector((state) => state.sprint.list)
  const selectedVersion = useSelector(
    (state) => state.sprint.selectedSprintId
  )
  
  const setSelectedSprint = (value) => {
    dispatch(sprintActions.setSelectedSprintId(value))
  }

  const computedSprintsList = useMemo(() => {
    return sprintsList?.map((sprint) => ({
      label: `Sprint week #${sprint.order_number}`,
      value: sprint.id,
    }))
  }, [sprintsList])

  const changeHandler = (val) => {
    if(onChange) onChange(val)
    else (setSelectedSprint(val))
  }

  if (!sprintsList?.[0]) return null

  return (
    <CSelect
      value={value ?? selectedVersion}
      onChange={(e) => changeHandler(e.target.value)}
      options={computedSprintsList}
      // label="Sprint"
      color="warning"
      width="150px"
    />
  )
}

export default SprintSelect
