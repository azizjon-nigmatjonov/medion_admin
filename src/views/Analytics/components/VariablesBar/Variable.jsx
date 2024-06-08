import { useMemo } from "react"
import { useQuery } from "react-query"
import CSelect from "../../../../components/CSelect"
import request from "../../../../utils/request"
import styles from "./style.module.scss"

const Variable = ({ variable = {}, value, onChange }) => {
  const { data } = useQuery(["GET_DATA_BY_QUERY", variable.query], () => {
    if (variable.type !== "QUERY") return null

    return request.post("/query", {
      data: {},
      query: variable.query,
    })
  })

  const options = useMemo(() => {
    if (variable.type === "QUERY") {
      return data?.rows?.map((row) => ({
        label: row[variable.view_field_slug],
        value: row[variable.field_slug],
      }))
    }

    if (variable.type === "CUSTOM") {
      return variable.options?.map((option) => ({
        value: option,
        label: option,
      }))
    }

    return []
  }, [variable, data])

  return (
    <div className={styles.variable}>
      <div className={styles.label}>{variable.label}</div>

      <div className={styles.value}>
        <CSelect
          disabledHelperText
          options={options}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  )
}

export default Variable
