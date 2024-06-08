import { Menu } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import useTabRouter from "../../hooks/useTabRouter"
import IconGenerator from "../IconPicker/IconGenerator"
import styles from "./style.module.scss"

const FormSelector = ({ tableSlug }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)
  const { navigateToForm } = useTabRouter()

  const tables = useSelector((state) => state.constructorTable.list)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const rowClickHandler = (table) => {
    navigateToForm(table.slug)
    closeMenu()
  }



  return (
    <div>
      <div onClick={openMenu} className={`${styles.addButton}`}>
        <IconGenerator icon={"plus.svg"} className={styles.buttonIcon} size={14} />
        <div className={styles.buttonTitle}>Добавить</div>
      </div>

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {tables.map((table, index) => (
            <div key={table.id} className={styles.menuItem} onClick={() => rowClickHandler(table)} >
              <IconGenerator
                icon={table.icon}
                className={`${styles.dragIcon} drag-handle`}
              />
              <p className={styles.itemText}>{table.label}</p>
            </div>
          ))}
        </div>
      </Menu>
    </div>
  )
}

export default FormSelector
