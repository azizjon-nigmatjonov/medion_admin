import { CircularProgress, IconButton, Menu, TextField } from "@mui/material"
import { memo, useId, useMemo, useRef, useState } from "react"
import useDebouncedWatch from "../../hooks/useDebouncedWatch"
import { iconsList } from "../../utils/constants/iconsList"
import IconGenerator from "./IconGenerator"
import styles from "./style.module.scss"

const IconPicker = ({
  value = "",
  onChange,
  customeClick,
  clickItself,
    tabIndex,
  error,
  loading,
  shape = "circle",
  disabled,
  ...props
}) => {
  const buttonRef = useRef()
  const id = useId()

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [computedIconsList, setComputedIconsList] = useState(
    iconsList.slice(0, 40)
  )

  const handleClose = () => setDropdownIsOpen(false)

  const handleOpen = () => setDropdownIsOpen(true)

  useDebouncedWatch(
    () => {
      const filteredList = iconsList.filter((icon) => icon.includes(searchText))

      setComputedIconsList(filteredList.slice(0, 40))
    },
    [searchText],
    300
  )

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} />
      </IconButton>
    )

  return (
    <div onClick={(e) => e.stopPropagation()} {...props}>
      <div
        ref={buttonRef}
        className={`${styles.iconWrapper} ${error ? styles.error : ""} ${
          styles[shape]
        }`}
        style={{ backgroundColor: value ?? "#fff" }}
        aria-describedby={id}
        onClick={customeClick ? clickItself : !disabled && handleOpen}
      >
        <IconGenerator icon={value} />
      </div>

      <Menu
        id={id}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        open={dropdownIsOpen}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        classes={{ paper: styles.menuPaper, list: styles.menuList }}
      >
        <TextField
          size="small"
          fullWidth
          value={searchText}
          autoFocus={tabIndex === 1}
          inputProps={{ tabIndex }}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className={styles.iconsBlock}>
          {computedIconsList.map((icon) => (
            <div
              key={icon}
              className={styles.popupIconWrapper}
              onClick={() => {
                onChange(icon)
                handleClose()
              }}
            >
              <IconGenerator icon={icon} />
            </div>
          ))}
        </div>
      </Menu>
    </div>
  )
}

export default memo(IconPicker)
