import { Close } from "@mui/icons-material"
import Dashboard from "@mui/icons-material/Dashboard"
import { IconButton } from "@mui/material"
import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useAnalyticsTabRouter from "../../hooks/useAnalyticsTabRouter"
import styles from "./style.module.scss"

const RouteTabComponent = ({ tab }) => {
  const { pathname } = useLocation()
  const { removeTab } = useAnalyticsTabRouter()
  const navigate = useNavigate()

  const title = useMemo(() => {
    return tab.title
  }, [])

  return (
    <div
      onClick={() => navigate(tab.link)}
      className={`${styles.tabComponent} ${
        pathname === tab.link ? styles.active : ""
      }`}
    >
      {/* <IconGenerator
        // icon={}
        className={styles.tabIcon}
        size={14}
      /> */}
      <Dashboard className={styles.tabIcon} />
      <div className={styles.title}>{title}</div>
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          removeTab(tab.link)
        }}
      >
        <Close />
      </IconButton>
    </div>
  )
}

export default RouteTabComponent
