
import { FilterAlt } from "@mui/icons-material"
import { Menu, Switch } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import FiltersBlockButton from "../../../../components/Buttons/FiltersBlockButton"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import { tableColumnActions } from "../../../../store/tableColumn/tableColumn.slice"
import styles from "./style.module.scss"

const FastFilterButton = () => {
  const { tableSlug } = useParams()
  const dispatch = useDispatch()

  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  )

  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const onChecked = (value, index) => {
    dispatch(
      tableColumnActions.setColumnFilterVisible({
        tableSlug,
        index,
        isFilterVisible: value,
      })
    )
  }

  return (
    <div>
      <RectangleIconButton color="white" onClick={openMenu} >
        <FilterAlt />
      </RectangleIconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {columns.map((column, index) => (
            <div key={column.id} className={styles.menuItem}>
              <p className={styles.itemText}>{column.label}</p>
              <Switch
                checked={column.isFilterVisible}
                onChange={(_, value) => onChecked(value, index)}
              />
            </div>
          ))}
        </div>
      </Menu>
    </div>
  )
}

export default FastFilterButton
