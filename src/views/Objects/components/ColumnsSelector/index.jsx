import { DragIndicator, TableChart } from "@mui/icons-material"
import { Menu, Switch } from "@mui/material"
import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Draggable } from "react-smooth-dnd"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import { tableColumnActions } from "../../../../store/tableColumn/tableColumn.slice"
import { applyDrag } from "../../../../utils/applyDrag"
import styles from "./style.module.scss"

const ColumnsSelector = ({ tableSlug }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const dispatch = useDispatch()

  const columns = useSelector((state) => state.tableColumn.list[tableSlug] ?? [])

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const isAllChecked = useMemo(
    () => columns.every((column) => column.isVisible),
    [columns]
  )

  const onChecked = (value, index) => {
    dispatch(
      tableColumnActions.setColumnVisible({
        tableSlug,
        index,
        isVisible: value,
      })
    )
  }

  const onAllChecked = (_, value) => {
    dispatch(
      tableColumnActions.setAllColumnsVisible({ tableSlug, isVisible: value })
    )
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult)

    dispatch(tableColumnActions.setColumnsPosition({ tableSlug, columns: result }))
  }

  return (
    <div>
      <RectangleIconButton
        onClick={openMenu}
        color="white"
      >
        <TableChart />
      </RectangleIconButton>

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.menuItem}>
          <p className={styles.itemText}>
            <strong>Все</strong>
          </p>

          <Switch checked={isAllChecked} onChange={onAllChecked} />
        </div>

        <div className={styles.scrollBlocksss}>
          <Container
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            dragHandleSelector=".drag-handle"
          >
          {columns.map((column, index) => (
            <Draggable key={column.id} >
              <div key={column.id} className={styles.menuItem}>
                <DragIndicator className={`${styles.dragIcon} drag-handle`} />
                <p className={styles.itemText}>{column.label}</p>
                <Switch
                  checked={column.isVisible}
                  onChange={(_, value) => onChecked(value, index)}
                />
              </div>
            </Draggable>
          ))}
          </Container>
        </div>
      </Menu>
    </div>
  )
}

export default ColumnsSelector
