import { Check, Delete, Settings } from "@mui/icons-material"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { useRef, useState } from "react"
import styles from "./style.module.scss"

const SectionSettingsDropdown = ({
  onDelete = () => {},
  columnType,
  setColumnType,
}) => {
  const buttonRef = useRef()
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false)

  const handleClose = () => setDropdownIsOpen(false)

  const handleOpen = () => setDropdownIsOpen(true)

  return (
    <>
      <IconButton ref={buttonRef} onClick={handleOpen}>
        <Settings />
      </IconButton>
      <Menu
        anchorEl={buttonRef.current}
        open={dropdownIsOpen}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        classes={{ paper: styles.menuPaper, list: styles.menuList }}
      >
        <MenuItem
          className={styles.menuItem}
          onClick={() => {
            setColumnType("SINGLE")
          }}
        >
          <div className={styles.menuItemIcon}>
            {/* {columnType !== "DOUBLE" && ( */}
              <Check color="success" fontSize="small" />
            {/* )} */}
          </div>
          Single column
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            setColumnType("DOUBLE")
          }}
          className={styles.menuItem}
        >
          <div className={styles.menuItemIcon}>
            {columnType === "DOUBLE" && (
              <Check color="success" fontSize="small" />
            )}
          </div>
          Double column
        </MenuItem> */}
        <MenuItem onClick={onDelete} className={styles.menuItem}>
          <div className={styles.menuItemIcon}>
            <Delete color="error" fontSize="small" />
          </div>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default SectionSettingsDropdown
