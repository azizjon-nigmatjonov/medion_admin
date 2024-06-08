import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import "./style.scss"

const BackButton = ({ className = "", ...props }) => {
  return (
    <button type="button" className={`BackButton ${className}`} {...props}>
      <ArrowBackIcon className="icon" />
    </button>
  )
}

export default BackButton
