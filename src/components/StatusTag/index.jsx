import { useMemo } from "react"
import { useSelector } from "react-redux"
import "./style.scss"

const StatusTag = ({ statusId }) => {
  const statusList = useSelector((state) => state.status.list)

  const computedStatus = useMemo(() => {
    if (!statusId || !statusList?.length) return null
    const selectedStatus = statusList.find((el) => el.id === statusId)
    return selectedStatus
  }, [statusId, statusList])

  return <div className="StatusTag" style={{ backgroundColor: computedStatus?.color + "30", color: computedStatus?.color ?? "#fff" }} >
    { computedStatus?.title }
  </div>
}

export default StatusTag
