import { Checkbox } from "@mui/material"
import { useMemo } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import HFCheckbox from "../../../../components/FormElements/HFCheckbox"
import { applyDrag } from "../../../../utils/applyDrag"
import styles from "./style.module.scss"

const ColumnsTab = ({ form }) => {
  const { fields: columns, move } = useFieldArray({
    control: form.control,
    name: "columns",
    keyName: "key",
  })

  const watchedColumns = useWatch({
    control: form.control,
    name: "columns",
  })

  const onDrop = (dropResult) => {
    const result = applyDrag(columns, dropResult)
    if (result) move(dropResult.removedIndex, dropResult.addedIndex)
  }

  const isAllChecked = useMemo(() => {
    return watchedColumns?.every((column) => column.is_checked)
  }, [watchedColumns])

  const onAllChecked = (_, val) => {

    const columns = form.getValues('columns')

    columns?.forEach((column, index) => {
      form.setValue(`columns[${index}].is_checked`, val)
    })
  }

  return (
    <div>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.cell} style={{ flex: 1 }}> <b>All</b> </div>
          <div className={styles.cell} style={{ width: 70 }}>
            <Checkbox
              checked={isAllChecked}
              onChange={onAllChecked}
            />
          </div>
        </div>
        <Container
          onDrop={onDrop}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {columns.map((column, index) => (
            <Draggable key={column.id}>
              <div key={column.id} className={styles.row}>
                <div className={styles.cell} style={{ flex: 1 }}>
                  {column.label}
                </div>
                <div className={styles.cell} style={{ width: 70 }}>
                  <HFCheckbox
                    control={form.control}
                    name={`columns[${index}].is_checked`}
                  />
                </div>
              </div>
            </Draggable>
          ))}
        </Container>
      </div>
    </div>
  )
}

export default ColumnsTab
