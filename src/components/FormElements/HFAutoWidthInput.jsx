import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import AutoWidthInput from "../AutoWidthInput"

const HFAutoWidthInput = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  rules = {},
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <AutoWidthInput value={value} onChange={onChange} {...props} />
      )}
    ></Controller>
  )
}

export default HFAutoWidthInput
