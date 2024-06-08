import { Logout } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import { authActions } from "../../store/auth/auth.slice"
import RectangleIconButton from "./RectangleIconButton"
import styles from "./style.module.scss"

const ExitButton = () => {
  const dispatch = useDispatch()

  const clickHandler = () => {
    dispatch(authActions.logout())
  }

  return (
    <RectangleIconButton
      onClick={clickHandler}
      color="primary"
      className={`${styles.exitButton}`}
    >
      <Logout />
    </RectangleIconButton>
  )
}

export default ExitButton
