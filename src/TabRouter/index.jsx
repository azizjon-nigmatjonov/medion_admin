import Sidebar from "../components/Sidebar"
import styles from "./style.module.scss"

const TabRouter = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        
      </div>
    </div>
  )
}

export default TabRouter
