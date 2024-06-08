import { AddCircleOutline } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./style.module.scss"

const CreatePanelButton = () => {
  const {pathname} = useLocation()
  const navigate = useNavigate()

  
  const navigateToCreateForm = (e) => {
    navigate(`${pathname}/panel/create`)
  }

  return ( <div className={styles.createPanelButton} onClick={navigateToCreateForm} >
    
    <AddCircleOutline sx={{ fontSize: 40 }} />

    <p className={styles.createPanelText} >Add new graph</p>

  </div> );
}
 
export default CreatePanelButton;