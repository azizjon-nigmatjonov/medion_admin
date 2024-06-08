import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useMemo } from "react"
import { useState } from "react"
import { useMutation } from "react-query"
import { useParams } from "react-router-dom"
import { Container, Draggable } from "react-smooth-dnd"
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator"
import constructorObjectService from "../../../services/constructorObjectService"
import { applyDrag } from "../../../utils/applyDrag"
import styles from "./style.module.scss"

const BoardColumn = ({
  tab,
  data = [],
  fieldsMap,
  view = [],
  navigateToCreatePage,
}) => {
  const { tableSlug } = useParams()
  const [computedData, setComputedData] = useState(
    data.filter((el) => {
      if(Array.isArray(el[tab.slug])) return el[tab.slug].includes(tab.value)
      return el[tab.slug] === tab.value
    })
  )
    
  const { mutate } = useMutation((data) => {
    return constructorObjectService.update(tableSlug, {
      data: {
        ...data,
        [tab.slug]: tab.value,
      },
    })
  })

  const onDrop = (dropResult) => {
    const result = applyDrag(computedData, dropResult)

    if (result) setComputedData(result)

    if (result?.length > computedData?.length) {
      mutate(dropResult.payload)
    }
  }

  const viewFields = useMemo(() => {
    return view.columns?.map((id) => fieldsMap[id]).filter((el) => el) ?? []
  }, [view, fieldsMap])

  return (
    <div className={styles.column}>
      <div className={`${styles.columnHeaderBlock} column-header`}>
        <div className={styles.title}>{tab.label}</div>
        <div className={styles.rightSide}>
          <div className={styles.counter}>{computedData?.length ?? 0}</div>
          <IconButton color="primary" onClick={navigateToCreatePage}>
            <Add />
          </IconButton>
        </div>
      </div>

      <Container
        style={{
          height: "calc(100vh - 170px)",
          overflow: "auto",
          borderRadius: "6px",
        }}
        groupName="subtask"
        getChildPayload={(i) => computedData[i]}
        onDrop={onDrop}
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
      >
        {computedData.map((el) => (
          <Draggable key={el.guid}>
            <div className={styles.card}>
              {viewFields.map((field) => (
                <BoardCardRowGenerator key={field.id} field={field} el={el} />
              ))}
            </div>
          </Draggable>
        ))}
      </Container>
    </div>
  )
}

export default BoardColumn
