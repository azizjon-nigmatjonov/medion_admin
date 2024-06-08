import { FormControl, MenuItem, Select } from "@mui/material"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import "./style.scss"

const StatusSelect = ({ status, setStatus, typeId, disabled }) => {
  const statusList = useSelector((state) => state.status.list)
  // const taskTypeList = useSelector(state => state.taskType.list)

  const computedStatusList = useMemo(() => {
    if (!typeId) return []
    return statusList.filter((status) => status.project_task_type_id === typeId)
  }, [statusList, typeId])

  const changeHandler = (e) => {
    const value = e.target.value
    setStatus(value)
  }

  const computedStatusColor = useMemo(() => {
    if (!status || !statusList?.length) return ""
    const selectedStatus = statusList.find((el) => el.id === status)
    return selectedStatus?.color ?? '#0067F4'
  }, [status, statusList])


  return (
    <FormControl>
      <Select
        onClick={(e) => e.stopPropagation()}
        className={`StatusSelect ${computedStatusColor} ${disabled ? 'disabled' : ''}`}
        style={{ backgroundColor: computedStatusColor}}
        size="small"
        id="grouped-select"
        value={status}
        onChange={changeHandler}
        disabled={disabled}
      >
        {computedStatusList?.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {status.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default StatusSelect
