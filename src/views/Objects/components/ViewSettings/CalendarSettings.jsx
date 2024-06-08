import { Divider, Typography } from "@mui/material"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { useQuery } from "react-query"
import FRow from "../../../../components/FormElements/FRow"
import HFSelect from "../../../../components/FormElements/HFSelect"
import constructorFieldService from "../../../../services/constructorFieldService"
import constructorTableService from "../../../../services/constructorTableService"
import listToOptions from "../../../../utils/listToOptions"
import styles from "./style.module.scss"




const CalendarSettings = ({ columns, form }) => {

  const computedColumns = useMemo(() => {
    return listToOptions(columns, 'label', 'slug')
  }, [ columns ])

  const computedPickListColumns = useMemo(() => {

    const filteredColumns = columns.filter(({ type }) => type === 'PICK_LIST' || type === 'MULTISELECT')
    return listToOptions(filteredColumns, 'label', 'id')
  }, [ columns ])

  const selectedDisableDatesTableSlug = useWatch({
    control: form.control,
    name: "disable_dates.table_slug"
  })


  const { data: tablesList = [] } = useQuery(["GET_TABLES_LIST"], () => {
    return constructorTableService.getList()
  }, {
    select: (data) => listToOptions(data?.tables, 'label', 'slug')
  })

  const { data: disabledDateFieldsList = [] } = useQuery(['GET_TABLE_FIELDS', selectedDisableDatesTableSlug], () => {
    if (!selectedDisableDatesTableSlug) return []
    return constructorFieldService.getList({ table_slug: selectedDisableDatesTableSlug })
  }, {
    select: ({ fields }) => listToOptions(fields?.filter(field => field.type !== 'LOOKUP'), "label", "slug")
  })

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Calendar settings</div>
      </div>

      <div className={styles.sectionBody}>
        
        <div className={styles.formRow}>
          <FRow label="Time from">
            <HFSelect options={computedColumns} control={form.control} name="calendar_from_slug" />
          </FRow>
          <FRow label="Time to">
            <HFSelect options={computedColumns} control={form.control} name="calendar_to_slug" />
          </FRow>
        </div>

        <div className={styles.formRow}>
          <FRow label="Time interval">
            <HFSelect options={timeIntervalOptions} control={form.control} name="time_interval" />
          </FRow>


          <FRow label="Status field">
            <HFSelect options={computedPickListColumns} control={form.control} name="status_field_slug" />
          </FRow>
          

        </div>

        <Divider className="my-1" />
          <Typography variant="h5" >Schedule</Typography>
        <Divider className="my-1" />


        <div className={styles.formRow}>
          <FRow label="Table">
            <HFSelect options={tablesList} control={form.control} name="disable_dates.table_slug" />
          </FRow>
          <FRow label="Day">
            <HFSelect options={disabledDateFieldsList} control={form.control} name="disable_dates.day_slug" />
          </FRow>
        </div>

        <div className={styles.formRow}>
          <FRow label="Time from">
            <HFSelect options={disabledDateFieldsList} control={form.control} name="disable_dates.time_from_slug" />
          </FRow>
          <FRow label="Time to">
            <HFSelect options={disabledDateFieldsList} control={form.control} name="disable_dates.time_to_slug" />
          </FRow>
        </div>




      </div>
    </div>
  )
}


const timeIntervalOptions = [
  {
    label: '5 минут',
    value: 5
  },
  {
    label: "10 минут",
    value: 10
  },
  {
    label: "15 минут",
    value: 15
  },
  {
    label: "20 минут",
    value: 20
  },
  {
    label: "30 минут",
    value: 30
  },
  {
    label: '45 минут',
    value: 45
  },
  {
    label: "1 час",
    value: 60
  }
]

export default CalendarSettings
