import {
  AccountBalanceWallet,
  Add,
  Contactless,
  Payment,
  Payments,
  Settings,
} from "@mui/icons-material"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { useId } from "react"
import { useState } from "react"
import style from "./style.module.scss"

const PaymentTypeSelector = ({ onSelect = () => {} }) => {
  const id = useId()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <Add style={{ fontSize: 50 }} />
      </IconButton>
      <Menu
        id={id}
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            onSelect('Наличними')
            handleClose()
          }}
          className={style.menuItem}
        >
          <Payments color="success" className={style.icon} />
          Наличними
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSelect('UzCard')
            handleClose()
          }}
          className={style.menuItem}
        >
          <Payment color="error" className={style.icon} />
          UzCard
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSelect('Humo')
            handleClose()
          }}
          className={style.menuItem}
        >
          <Payment color="error" className={style.icon} />
          Humo
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSelect('Payme')
            handleClose()
          }}
          className={style.menuItem}
        >
          <Contactless color="warning" className={style.icon} />
          Payme
        </MenuItem>
        {/*<MenuItem
          onClick={() => {
            onSelect('Click')
            handleClose()
          }}
          className={style.menuItem}
        >
          <AccountBalanceWallet color="primary" className={style.icon} />
          Click
        </MenuItem>*/}
      </Menu>
    </div>
  )
}

export default PaymentTypeSelector
