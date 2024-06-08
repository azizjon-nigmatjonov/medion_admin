import { Switch } from "@mui/material";
import { useId } from "react";
import { Controller } from "react-hook-form";

const HFSwitch = ({
  control,
  name,
  label,
  disabledHelperText,
  tabIndex,
  isBlackBg,
  onChange = () => {},
  labelProps,
  defaultValue = false,
  ...props
}) => {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({
        field: { onChange: formOnChange, value },
        fieldState: { error },
      }) => {
        return (
          <div
            className={!disabledHelperText ? "mb-1" : ""}
            style={{
              background: isBlackBg ? "#2A2D34" : "",
              color: isBlackBg ? "#fff" : "",
            }}
          >
            <Switch
              id={`switch-${id}`}
              {...props}
              autoFocus={tabIndex === 1}
                inputProps={{ tabIndex }}
              checked={value ?? false}
              onChange={(e, val) => {
                formOnChange(val);
                onChange(val);
              }}
            />
            <label htmlFor={`switch-${id}`} {...labelProps}>
              {label}
            </label>
          </div>
        );
      }}
    ></Controller>
  );
};

export default HFSwitch;
