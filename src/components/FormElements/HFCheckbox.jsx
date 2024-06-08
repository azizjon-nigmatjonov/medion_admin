import { Checkbox } from "@mui/material";
import { useId } from "react";
import { Controller } from "react-hook-form";

const HFCheckbox = ({
  control,
  isBlackBg,
  name,
  label,
    tabIndex,
  className,
  defaultValue = false,
  ...props
}) => {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div
          className={className}
          style={{
            background: isBlackBg ? "#2A2D34" : "",
            color: isBlackBg ? "#fff" : "",
          }}
        >
          <Checkbox
            id={`checkbox-${id}`}
            style={{ transform: "translatey(-1px)" }}
            checked={value ?? false}
            autoFocus={tabIndex === 1}
            onChange={(_, val) => onChange(val)}
            {...props}
              inputProps={
                tabIndex
              }
          />
          <label htmlFor={`checkbox-${id}`}>{label}</label>
        </div>
      )}
    ></Controller>
  );
};

export default HFCheckbox;
