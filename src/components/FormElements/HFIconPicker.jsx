import { FormHelperText } from "@mui/material"
import { Controller } from "react-hook-form"
import IconPicker from "../IconPicker"

const HFIconPicker = ({
  control,
    tabIndex,
  name,
  disabledHelperText = false,
  required = false,
  rules = {},
  disabled = false,
  customeClick = false,
  clickItself = () => {},
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
        <div>
          <IconPicker
            disabled={disabled}
            error={error}
            value={value}
            tabIndex={tabIndex}
            onChange={onChange}
            customeClick={customeClick}
            clickItself={clickItself}
            {...props}
          />
          {!disabledHelperText && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </div>
      )}
    ></Controller>
  )
}

export default HFIconPicker
