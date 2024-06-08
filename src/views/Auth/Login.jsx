import LoginForm from "./components/LoginForm"
import styles from "./style.module.scss"

const Login = () => {

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Вход в систему</h1>
      <p className={styles.subtitle}>
        Заполните данные для входа в аккаунт
      </p>

      <LoginForm />
    </div>
  )
}

export default Login
