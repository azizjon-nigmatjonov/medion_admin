


import { JoinInner } from "@mui/icons-material"
import { Menu } from "@mui/material"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import CMultipleSelect from "../../../../components/CMultipleSelect"
import FRow from "../../../../components/FormElements/FRow"
import { tableColumnActions } from "../../../../store/tableColumn/tableColumn.slice"
import listToOptions from "../../../../utils/listToOptions"
import { selectElementFromEndOfString } from "../../../../utils/selectElementFromEnd"
import styles from "./style.module.scss"

const CalendarGroupFieldSelector = ({ tableSlug }) => {
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  )

  const relationColumns = useSelector((state) => state.tableColumn.relationColumns[tableSlug] ?? [])

  const groupColumns = useSelector((state) => state.tableColumn.calendarGroupColumns[tableSlug] ?? [])
  
  const filteredColumns = useMemo(() => {
    return columns.filter(
      ({ type, id }) => type === "PICK_LIST" || id.includes("#")
    ).map(el => ({
      ...el,
      table_slug: el.type === "PICK_LIST" ? tableSlug : el.id.split('#')[0],
      slug: el.type === "PICK_LIST" ? el.slug : `${el.id.split('#')[0]}_id`,
    }))
  }, [columns, tableSlug])

  const filteredRelationColumns = useMemo(() => {
    return relationColumns.filter(
      ({ type, id }) => type === "PICK_LIST" || type === "LOOKUP"
    )?.map(el => ({
      ...el,
      label: `${el.table_label} - ${el.label}`,
      table_slug: el.type === "PICK_LIST" ? selectElementFromEndOfString({ string: el.slug, separator: ".", index: 2 }) : selectElementFromEndOfString({ string: el.slug, separator: ".", index: 1 })?.slice(0, -3),
      attributes: el.type === "PICK_LIST" ? el.attributes : el.view_fields
    }))
  }, [relationColumns])

  
  const computedColumns = useMemo(() => {
    return [...filteredColumns, ...filteredRelationColumns]
  }, [filteredColumns, filteredRelationColumns])

  const computedOptions = useMemo(() => {
    return listToOptions(computedColumns, "label")
  }, [computedColumns])

  const computedValues = useMemo(() => {
    return groupColumns?.map(el => el.id) ?? []
  }, [groupColumns])

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }
  
  const onSelect = (e) => {
    const value = e.target.value
    const computedValue = value?.map(el => computedColumns.find(col => col.id === el)) ?? []
    dispatch(tableColumnActions.setCalendarGroupColumn({ tableSlug, columns: computedValue }))
  }

  return (
    <div>
      <RectangleIconButton onClick={openMenu} color="white">
        <JoinInner />
      </RectangleIconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.block}>
          <FRow label={"Group by"}>
            <CMultipleSelect
              disabledHelperText
              options={computedOptions}
              value={computedValues}
              onChange={onSelect}
            />
          </FRow>
        </div>
      </Menu>
    </div>
  )
}

export default CalendarGroupFieldSelector
