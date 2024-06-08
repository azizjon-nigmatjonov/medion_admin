import { memo } from "react"
import "./style.scss"
import { FiberNew, Functions, Close, Done, HourglassEmpty, Loop, TableRows } from "@mui/icons-material" 

const StatusCard = ({ title, count = 0, total = 0, disablePercent }) => {
  const { icon, color } = generateIconAndColor(title)

  const percent = count && total ? Math.round(Number(count) * 100 / Number(total)) : 0
  
  return (
    <div className="StatusCard silver-right-border">
      <StatusIcon icon={icon} color={color} />
      <div className="info-side">
        <div className="label">{title}</div>
        <div className="value">
          <span className="number" style={{ color }} >{ count }</span>
          {!disablePercent && <span className="percent">({ percent }%)</span>}
        </div>
      </div>
    </div>
  )
}

export default memo(StatusCard)

const StatusIcon = ({ icon, color }) => {
  return (
    <div className="StatusIcon" style={{ backgroundColor: color }}>
      {icon}
    </div>
  )
}

const generateIconAndColor = (title) => {
  if (title?.includes("TOTAL"))
    return {
      icon: <Functions className="icon" />,
      color: "#A23FEE",
    }

  switch (title) {
    case "NEW":
      return {
        icon: <FiberNew className="icon" />,
        color: "#4094F7",
      }

    case "PROCESSING":
      return {
        icon: <Loop className="icon" />,
        color: "#F8C51B",
      }

    case "PENDING":
      return {
        icon: <HourglassEmpty className="icon" />,
        color: "#FF981F",
      }

    case "REJECTED":
      return {
        icon: <Close className="icon" />,
        color: "#F76659",
      }

    case "DONE":
      return {
        icon: <Done className="icon" />,
        color: "#22C348",
      }

    default:
      break
  }

  return {
    icon: <TableRows className="icon" />,
    color: "#4094F7",
  }
}
