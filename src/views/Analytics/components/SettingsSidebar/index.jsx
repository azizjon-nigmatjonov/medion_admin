import { Calculate, Tune } from "@mui/icons-material"
import { NavLink, useParams } from "react-router-dom"
import styles from "./style.module.scss"

const SettingsSidebar = () => {
  const { id } = useParams()

  return (
    <div className={styles.sidebar}>
      <NavLink
        to={`/analytics/dashboard/${id}/settings/main`}
        className={({ isActive }) =>
          !isActive ? styles.element : `${styles.element} ${styles.active}`
        }
      >
        <Tune className={styles.icon} />

        <div className={styles.title}>Общие</div>
      </NavLink>

      <NavLink
        to={`/analytics/dashboard/${id}/settings/variables`}
        className={({ isActive }) =>
          !isActive ? styles.element : `${styles.element} ${styles.active}`
        }
      >
        <Calculate className={styles.icon} />
        
        <div className={styles.title}>Переменные</div>
      </NavLink>
    </div>
  )
}

export default SettingsSidebar
