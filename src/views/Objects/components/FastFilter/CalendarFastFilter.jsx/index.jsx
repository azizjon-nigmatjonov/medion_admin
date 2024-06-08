import {} from "@mui/icons-material"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { selectElementFromEndOfString } from "../../../../../utils/selectElementFromEnd"
import { Filter } from "../../FilterGenerator"
import styles from "../style.module.scss"

const CalendarFastFilter = ({ filters, onChange }) => {
  const { tableSlug } = useParams()

  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  )

  const relationColumns = useSelector(
    (state) => state.tableColumn.relationColumns[tableSlug] ?? []
  )

  const computedFields = useMemo(() => {
    return columns.filter((column) => column.isFilterVisible)
  }, [columns])

  const computedRelationFields = useMemo(() => {
    return relationColumns.filter((column) => column.isFilterVisible)?.map(column => {
      const tableSlug = column.type === "PICK_LIST" ? selectElementFromEndOfString({ string: column.slug, separator: ".", index: 2 }) : selectElementFromEndOfString({ string: column.slug, separator: ".", index: 1 })?.slice(0, -3)
      const attributes = column.view_fields

      return {...column, id: `${tableSlug}#${column.id}`, attributes}
    })
  }, [relationColumns])

  return (
    <div className={styles.filtersBlock}>
      {computedFields.map((filter) => (
        <div className={styles.filter} key={filter.id}>
          <Filter
            field={filter}
            name={filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}

      {computedRelationFields.map((filter) => (
        <div className={styles.filter} key={filter.id}>
          <Filter
            field={filter}
            name={filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  )
}

export default CalendarFastFilter
