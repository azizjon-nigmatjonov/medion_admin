import { Controller } from "react-hook-form";
import CDateTimePickerLegacy from "../DatePickers/CDateTimePickerLegacy";

const HFDateTimePicker = ({
  control,
  className,
  name,
  label,
  width,
  inputProps,
  disabledHelperText,
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <CDateTimePickerLegacy
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }}
    ></Controller>
  );
};

export default HFDateTimePicker;
