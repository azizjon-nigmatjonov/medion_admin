import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import "./style.scss"

const CollapseIcon = ({ isOpen, ...props }) => {
  return (
    <div className={`CollapseIcon ${isOpen && "open"}`} {...props}>
      <ExpandMoreIcon color="primary" />
    </div>
  )
}

export default CollapseIcon
