import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
// import ESPselect from "~/components/ESPSelect"
import styles from "../style.module.scss"
import { authActions } from "../../../store/auth/auth.slice"
import { useDispatch } from "react-redux"

const ESPLoginForm = ({ navigateToRegistrationForm }) => {
  const dispatch = useDispatch()

  return (
    <form onSubmit={e => {
      e.stopPropagation()
      dispatch(authActions.login())
    }} className={styles.form}>
      <div className={styles.formArea}>
        <div className={styles.formRow}>
          <p className={styles.label}>Выберите ЕЦП ключ</p>
          {/* <ESPselect /> */}
        </div>
      </div>

      <div className={styles.buttonsArea}>
        <PrimaryButton>Войти</PrimaryButton>
        <SecondaryButton type="button" onClick={navigateToRegistrationForm} >Зарегистрироваться</SecondaryButton>
      </div>

    </form>
  )
}

export default ESPLoginForm
