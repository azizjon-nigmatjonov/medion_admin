import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import DrawerCard from "../../../../../components/DrawerCard"
import FRow from "../../../../../components/FormElements/FRow"
import { useParams } from "react-router-dom"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import { fieldTypes } from "../../../../../utils/constants/fieldTypes"
import { Divider } from "@mui/material"
import Attributes from "./Attributes"
import { useQuery } from "react-query"
import constructorFieldService from "../../../../../services/constructorFieldService"
import listToOptions from "../../../../../utils/listToOptions"

const FieldCreateForm = ({
  onSubmit,
  closeDrawer,
  initialValues = {},
  open,
  isLoading = false,
  mainForm,
}) => {
  const { id } = useParams()
  const { handleSubmit, control, reset, watch, getValues } = useForm()

  const submitHandler = (values) => {
    onSubmit(values)
  }
  
  const selectedAutofillTableSlug = useWatch({
    control,
    name: 'autofill_table'
  })

  const layoutRelations = useWatch({
    control: mainForm.control,
    name: "layoutRelations",
  })


  const computedRelationTables = useMemo(() => {
    return layoutRelations?.map(table => ({
      value: table.id?.split('#')?.[0],
      label: table.label,
    }))
  }, [layoutRelations])


  const { data: computedRelationFields } = useQuery(['GET_TABLE_FIELDS', selectedAutofillTableSlug], () => {
    if (!selectedAutofillTableSlug) return []
    return constructorFieldService.getList({ table_slug: selectedAutofillTableSlug })
  }, {
    select: ({ fields }) => listToOptions(fields?.filter(field => field.type !== 'LOOKUP'), "label", "slug")
  })
  
  // const { data } = useQuery(['GET_TABLES_LIST'], () => {
  //   return constructorTableService.getList()
  // }, { select: (res) => res?.data ?? [] })
  

  const computedFieldTypes = useMemo(() => {
    return fieldTypes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  useEffect(() => {
    if (initialValues !== "CREATE")
      reset({
        attributes: {},
        default: "",
        index: "string",
        label: "",
        required: false,
        slug: "",
        table_id: id,
        type: "",
        ...initialValues,
      })
    else
      reset({
        attributes: {},
        default: "",
        index: "string",
        label: "",
        required: false,
        slug: "",
        table_id: id,
        type: "",
      })
  }, [open])
  
  return (
    <DrawerCard
      title={initialValues === "CREATE" ? "Create field" : "Edit field"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(submitHandler)}
      loader={isLoading}
      
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <FRow label="Field Label" required>
          <HFTextField
            disabledHelperText
            fullWidth
            name="label"
            control={control}
            placeholder="Field Label"
            autoFocus
            required
          />
        </FRow>

        <FRow label="Field SLUG" required>
          <HFTextField
            disabledHelperText
            fullWidth
            name="slug"
            control={control}
            placeholder="Field SLUG"
            required
            withTrim
          />
        </FRow>

        <FRow label="Field type" required>
          <HFSelect
            disabledHelperText
            name="type"
            control={control}
            options={computedFieldTypes}
            placeholder="Type"
            required
          />
        </FRow>

        <Divider style={{ margin: "20px 0" }} />

        <Attributes control={control} watch={watch} mainForm={mainForm} />

        <>
        <Divider style={{ margin: "20px 0" }} />

        <FRow label="Autofill table">
          <HFSelect
            disabledHelperText
            name="autofill_table"
            control={control}
            options={computedRelationTables}
            placeholder="Type"
          />
        </FRow>

        <FRow label="Autofill field">
          <HFSelect
            disabledHelperText
            name="autofill_field"
            control={control}
            options={computedRelationFields}
            placeholder="Type"
          />
        </FRow>
        </>

        {/* <FRow label="Fields">
          <HFMultipleSelect
            name="view_fields"
            control={control}
            options={relatedTableFields}
            allowClear
          />
        </FRow> */}
      </form>
    </DrawerCard>
  )
}

export default FieldCreateForm
