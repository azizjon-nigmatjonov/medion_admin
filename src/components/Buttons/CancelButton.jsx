import { Button, CircularProgress } from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel"

const CancelButton = ({ children, loading, title = "Cancel", icon=<CancelIcon />, ...props }) => {
  return (
    <Button
      style={{ minWidth: 130 }}
      startIcon={loading ? <CircularProgress size={14} style={{ color: '#fff' }} /> : icon}
      variant="contained"
      color="error"
      {...props}
    >
      {title}
    </Button>
  )
}

export default CancelButton
