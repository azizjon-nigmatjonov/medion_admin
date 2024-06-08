import { Controller } from "react-hook-form"
import CCalendar from "../DatePickers/CCalendar"


const HFMultipleCalendar = ({
  control,
  name = "",
  required = false,
  rules = {},
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CCalendar
          value={value}
          onChange={onChange}
          name={name}
          error={error}
          {...props}
        />
      )}
    ></Controller>
  )
}

export default HFMultipleCalendar
