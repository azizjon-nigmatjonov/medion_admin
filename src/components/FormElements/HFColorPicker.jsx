import { Controller } from "react-hook-form"
import ColorPicker from "../ColorPicker"

const HFColorPicker = ({
  control,
  name,
  disabledHelperText = false,
  required = false,
  rules = {},
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
        <>
          <ColorPicker
            error={error}
            value={value}
            onChange={onChange}
            customeClick={customeClick}
            clickItself={clickItself}
            {...props}
          />
        </>
      )}
    ></Controller>
  )
}

export default HFColorPicker
