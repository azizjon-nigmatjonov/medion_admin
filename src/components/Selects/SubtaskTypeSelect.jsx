import { useMemo } from "react"
import { useSelector } from "react-redux"
import CSelect from "../CSelect"
import "./style.scss"
import IconGenerator from "../IconPicker/IconGenerator"

const SubtaskTypeSelect = ({ value, onChange = () => {}, disabled }) => {
  const subtaskTypeList = useSelector((state) => state.taskType.list)

  const computedTypeList = useMemo(() => {
    return subtaskTypeList?.map((type) => ({
      label: <IconGenerator className="asd" icon={type.icon} />,
      value: type.id,
    }))
  }, [subtaskTypeList])
  
  if (!subtaskTypeList?.[0]) return null

  return (
    <CSelect
      className={`SubtaskTypeSelect ${disabled ? "disabled" : ""}`}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      options={computedTypeList}
      width="100px"
    />
  )
}

export default SubtaskTypeSelect
