import { FilterAltOutlined } from "@mui/icons-material"
import { Menu } from "@mui/material"
import { useState } from "react"
import styles from "./style.module.scss"

const TableColumnFilter = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)
  
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div className={styles.filterWrapper}>
      <FilterAltOutlined
        classes={{ root: styles.filterIcon }}
        onClick={openMenu}
        className="pointer"
      />

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        {children}
      </Menu>
    </div>
  )
}

export default TableColumnFilter
