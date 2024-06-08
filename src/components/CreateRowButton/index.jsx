import { IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from '@mui/icons-material/Close';
import RectangleIconButton from "../Buttons/RectangleIconButton";

const CreateRowButton = ({ setFunction, formVisible, type="", ...props }) => {

  if(type === 'rectangle') return (
    <RectangleIconButton
      color={formVisible ? "error" : "primary"}
      onClick={(e) => {
        e.stopPropagation()
        setFunction((prev) => !prev)
      }}
      {...props}
    >
      {formVisible ? <CloseIcon color="error" /> : <AddIcon color="primary" />}
    </RectangleIconButton>
  )

  return (
    <IconButton
      color={formVisible ? "error" : "primary"}
      onClick={(e) => {
        e.stopPropagation()
        setFunction((prev) => !prev)
      }}
      {...props}
    >
      {formVisible ? <CloseIcon /> : <AddIcon />}
    </IconButton>
  )
}

export default CreateRowButton
