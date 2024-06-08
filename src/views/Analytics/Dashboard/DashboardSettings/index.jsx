import { Outlet, useParams } from "react-router-dom"
import Header from "../../../../components/Header"
import SettingsSidebar from "../../components/SettingsSidebar"
import styles from "./style.module.scss"

const DashboardSettings = () => {
  const { id } = useParams()

  return (
    <div>
      <Header
        title="Главная / Настройки"
        backButtonLink={`/analytics/dashboard/${id}`}
      />

      <div className="p-2" >
        <div className={styles.card}>
          <SettingsSidebar />
          
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardSettings
