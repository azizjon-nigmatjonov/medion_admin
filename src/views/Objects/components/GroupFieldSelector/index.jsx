import { JoinInner } from "@mui/icons-material"
import { Menu } from "@mui/material"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import CSelect from "../../../../components/CSelect"
import FRow from "../../../../components/FormElements/FRow"
import { tableColumnActions } from "../../../../store/tableColumn/tableColumn.slice"
import listToOptions from "../../../../utils/listToOptions"
import styles from "./style.module.scss"

const GroupFieldSelector = ({ tableSlug }) => {
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  )

  const groupColumnId = useSelector((state) => state.tableColumn.groupColumnIds[tableSlug])

  const computedColumns = useMemo(() => {
    const filteredColumns = columns.filter(
      ({ type, id }) => type === "PICK_LIST" || id.includes("#")
    )

    return listToOptions(filteredColumns, "label")
  }, [columns])


  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const onSelect = (e) => {
    dispatch(
      tableColumnActions.setGroupColumnId({
        tableSlug,
        id: e.target.value,
      })
    )
    closeMenu()
  }

  return (
    <div>
      <RectangleIconButton onClick={openMenu} color="white">
        <JoinInner />
      </RectangleIconButton>

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.block}>
          <FRow label={"Group by"}>
            <CSelect
              disabledHelperText
              options={computedColumns}
              value={groupColumnId}
              onChange={onSelect}
            />
          </FRow>
        </div>
      </Menu>
    </div>
  )
}

export default GroupFieldSelector
