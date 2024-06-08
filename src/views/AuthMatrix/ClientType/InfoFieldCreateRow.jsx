import { Button, Skeleton } from "@mui/material"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import HFTextField from "../../../components/FormElements/HFTextField"

const InfoFieldCreateRow = ({ onSubmit, loader, visible, setLoader = () => {}, initialValues, btnText="CREATE" }) => {

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      data_type: '',
      field_name: '',
      field_type: ''
    }
  })
  
  useEffect(() => {
    if (visible) {
      setLoader(false)
    }
    else {
      reset({
        data_type: initialValues?.data_type || '',
        field_name: initialValues?.field_name || '',
        field_type: initialValues?.field_type || ''
      })
    }
  }, [visible])

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
              name="field_name"
              label="Name"
              disabledHelperText
              // inputRef={input => input && visible && input.focus()}
            />
          </div>
          <div className="form-row">
            <HFTextField
              fullWidth
              control={control}
              name="data_type"
              label="Data type"
              disabledHelperText
            />
          </div>

          <div className="form-row">
            <HFTextField
              fullWidth
              control={control}
              name="field_type"
              label="Field type"
              disabledHelperText
            />
          </div>

          <div className="form-row">
            <Button type="submit" variant="contained" size="large" fullWidth >{ btnText }</Button>
          </div>
        </div>
      )}
    </form>
  )
}

export default InfoFieldCreateRow
