import { Add } from "@mui/icons-material"
import { Drawer, IconButton } from "@mui/material"
import { format } from "date-fns"
import { useState } from "react"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import useTabRouter from "../../../hooks/useTabRouter"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import MultipleInserForm from "./MultipleInserForm"
import styles from "./style.module.scss"

const DataBlock = ({ computedData, date, view, fieldsMap, tab }) => {
  const { tableSlug } = useParams()
  const data = computedData[format(date, "dd.MM.yyyy")]
  const { navigateToForm } = useTabRouter()
  const [drawerState, setDrawerState] = useState(null)

  const viewFields = useMemo(() => {
    if (!data) return []

    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el)
  }, [data, view, fieldsMap])

  const navigateToEditPage = () => {
    if (!data) return
    navigateToForm(tableSlug, "EDIT", data)
  }

  const navigateToCreatePage = () => {
    const startTimeStampSlug = view?.calendar_from_slug

    setDrawerState({
      [startTimeStampSlug]: [date],
      [tab?.slug]: tab?.value,
    })

    // navigateToForm(tableSlug, "CREATE", null, {
    //   [startTimeStampSlug]: date,
    //   [tab?.slug]: tab?.value,
    // })
  }

  return (
    <div
      className={`${styles.dataBlock} ${data ? styles.hasData : ""}`}
      onClick={navigateToEditPage}
    >
      {data ? (
        <div>
          {viewFields?.map((field) => (
            <div>
              <b>
                {field.attributes?.icon ? (
                  <IconGenerator
                    className={styles.linkIcon}
                    icon={field.attributes?.icon}
                    size={13}
                  />
                ) : (
                  field.label
                )}
                :{" "}
              </b>
              {field.type === "LOOKUP"
                ? getRelationFieldTableCellLabel(
                    field,
                    data,
                    field.slug + "_data"
                  )
                : data[field.slug]}
            </div>
          ))}
        </div>
      ) : (
        <IconButton className={styles.addButton} onClick={navigateToCreatePage}>
          <Add />
        </IconButton>
      )}

      <Drawer
        open={drawerState}
        onClose={() => setDrawerState(null)}
        anchor="right"
        classes={{ paperAnchorRight: styles.verticalDrawer }}
      >
        <MultipleInserForm
          onClose={() => setDrawerState(null)}
          view={view}
          fieldsMap={fieldsMap}
          drawerState={drawerState}
          tab={tab}
        />
      </Drawer>
    </div>
  )
}

export default DataBlock
