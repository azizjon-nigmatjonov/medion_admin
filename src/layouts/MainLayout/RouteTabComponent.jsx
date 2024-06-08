import { Close } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { get } from "@ngard/tiny-get"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import IconGenerator from "../../components/IconPicker/IconGenerator"
import useTabRouter from "../../hooks/useTabRouter"
import { getFieldLabel } from "../../utils/getFieldLabel"
import styles from "./style.module.scss"

const RouteTabComponent = ({ tab }) => {
  const { pathname } = useLocation()
  const { removeTab } = useTabRouter()
  const navigate = useNavigate()
  const tables = useSelector((state) => state.constructorTable.list)

  const tableInfo = useMemo(() => {
    return tables.find((el) => el.slug === tab.tableSlug) ?? {}
  }, [tables, tab.tableSlug])

  const title = useMemo(() => {
    if (tab.row) {
      return getFieldLabel(tab.row, tableInfo.subtitle_field_slug)
    }
    return `${tableInfo.label} (New)`
  }, [tableInfo, tab.row])

  return (
    <div
      onClick={() => navigate(tab.link)}
      className={`${styles.tabComponent} ${
        pathname === tab.link ? styles.active : ""
      }`}
    >
      <IconGenerator
        icon={tableInfo.icon}
        className={styles.tabIcon}
        size={14}
      />
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
