import { Button, Skeleton } from "@mui/material"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import HFMultipleSelect from "../../../components/FormElements/HFMultipleSelect"
import { useQuery } from "react-query"
import constructorTableService from "../../../services/constructorTableService"
import listToOptions from "../../../utils/listToOptions"
import HFSelect from "../../../components/FormElements/HFSelect"
import constructorFieldService from "../../../services/constructorFieldService"

const TableCreateRow = ({
  onSubmit,
  loader,
  visible,
  setLoader = () => {},
  initialValues,
  btnText = "CREATE",
}) => {
  const { control, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      slug: "",
      view_field: [],
    },
  })

  const tableSlug = watch("slug")

  const { data: tables } = useQuery(
    ["GET_TABLE_LIST"],
    () => {
      return constructorTableService.getList()
    },
    {
      select: ({ tables }) => listToOptions(tables, "label", "slug")
    }
  )

  const { data: fields } = useQuery(["GET_TABLE_FIELDS", tableSlug], () => {
    if (!tableSlug) return []
    return constructorFieldService.getList({ table_slug: tableSlug })
  }, {
    select: ({ fields }) => listToOptions(fields?.filter(field => field.type !== 'LOOKUP'), "label", "slug")
  })

  useEffect(() => {
    if (visible) {
      setLoader(false)
    } else {
      reset({
        slug: initialValues?.slug || "",
        view_field: initialValues?.view_field || "",
      })
    }
  }, [visible])

  const submitHandler = (values) => {

    const computedData = {
      ...values,
      label: tables.find(el => el.value === values.slug)?.label ?? ""
    }

    onSubmit(computedData)

  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(submitHandler)}
      className="row"
      style={{ width: "100%" }}
    >
      {loader ? (
        <Skeleton variant="text" style={{ width: "100%" }} />
      ) : (
        <div style={{ width: "100%" }}>
          <div className="form-row">
            <HFSelect
              options={tables}
              control={control}
              name="slug"
              label="Table"
              onChange={() => setValue('view_field', [])}
            />
          </div>

          <div className="form-row">
            <HFMultipleSelect
              options={fields}
              control={control}
              name="view_field"
              label="View fields"
            />
          </div>

          <div className="form-row">
            <Button type="submit" variant="contained" size="large" fullWidth>
              {btnText}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}

export default TableCreateRow
