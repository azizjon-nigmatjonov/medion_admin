import { Button, Skeleton } from "@mui/material"
import { useEffect, useMemo } from "react"
import { RELATION_TYPES } from "../../../utils/constants/authMatrix"
import { useForm } from "react-hook-form"
import HFTextField from "../../../components/FormElements/HFTextField"
import HFSelect from "../../../components/FormElements/HFSelect"


const RelationCreateRow = ({ onSubmit, loader, visible, setLoader = () => {}, initialValues, btnText="CREATE" }) => {

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      name: '',
      type: 0
    }
  })
  
  useEffect(() => {
    if (visible) {
      setLoader(false)
    }
    else {
      reset({
        description: initialValues?.description || '',
        name: initialValues?.name || '',
        type: initialValues?.type || ''
      })
    }
  }, [visible])

  const computedRelationTypes = useMemo(() => {
    return RELATION_TYPES.map((type, index) => ({
      label: type,
      value: index
    }))
  }, [])

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="row" style={{ width: '100%' }} >
      {loader ? (
        <Skeleton variant="text" style={{ width: "100%" }} />
      ) : (
        <div style={{ width: '100%' }} >
          <div className="form-row">
            <HFTextField
              fullWidth
              control={control}
              name="name"
              label="Name"
              disabledHelperText
              // inputRef={input => input && visible && input.focus()}
            />
          </div>

          <div className="form-row">
            <HFTextField
              fullWidth
              control={control}
              name="description"
              label="Description"
              disabledHelperText
              multiline
              rows={4}
            />
          </div>

          {/* <div className="form-row"> */}
            <HFSelect
              fullWidth
              control={control}
              options={computedRelationTypes}
              name="type"
              label="Type"
            />
          {/* </div> */}

          <div className="form-row">
            <Button type="submit" variant="contained" size="large" fullWidth >{ btnText }</Button>
          </div>
        </div>
      )}
    </form>
  )
}

export default RelationCreateRow
