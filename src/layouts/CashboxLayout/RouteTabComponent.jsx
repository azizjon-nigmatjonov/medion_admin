import { Close, Payments } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import IconGenerator from "../../components/IconPicker/IconGenerator"
import useCashboxTabRouter from "../../hooks/useCashboxTabRouter"
import styles from "./style.module.scss"

const RouteTabComponent = ({ tab }) => {
  const { pathname } = useLocation()
  const { removeTab } = useCashboxTabRouter()
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
      <Payments />
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
