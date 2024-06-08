import { Divider } from "@mui/material"
import { useState } from "react"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import CSelect from "../../../../components/CSelect"
import FRow from "../../../../components/FormElements/FRow"
import constructorObjectService from "../../../../services/constructorObjectService"

const CalendarStatusSelect = ({ view, fieldsMap, info, setInfo }) => {
  const { tableSlug } = useParams()

  const field = useMemo(() => {
    return fieldsMap[view.status_field_slug]
  }, [view, fieldsMap])

  const [value, setValue] = useState(info[field.slug] ?? '')

  const options = useMemo(() => {
    return field.attributes?.options?.map((option) => ({
      ...option,
      label: option.value
    }))
  }, [field])

  const onChange = (e) => {
    const value = e.target.value
    setValue(value)

    const computedData = {
      ...info,
      [field.slug]: value,
    }

    constructorObjectService.update(tableSlug, {
      data: computedData,
    }).then(res => setInfo(computedData))
  }

  return (
    <>
      <Divider style={{ marginBottom: 5 }} />
      <FRow label={field.label}>
        <CSelect options={options} disabledHelperText value={value} onChange={onChange} />
      </FRow>
    </>
  )
}

export default CalendarStatusSelect
