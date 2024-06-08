import { TextField, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTextFieldWithMask = ({
  control,
  name = "",
  isBlackBg = false,
  isFormEdit = false,
  disabledHelperText = false,
  required = false,
  rules = {},
  mask,
  disabled,
  tabIndex,
  placeholder,
  defaultValue,
  field,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputMask
          mask={mask}
          value={value ?? undefined}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {(inputProps) => (
            <Tooltip title={field?.attributes?.showTooltip && field?.attributes?.tooltipText}>
              <TextField
              size="small"
              name={name}
              error={error}
              helperText={!disabledHelperText && error?.message}
              placeholder={placeholder}
              className={isFormEdit ? "custom_textfield" : ""}
              autoFocus={tabIndex === 1}
              {...props}
              InputProps={{
                ...inputProps,
                inputProps: { tabIndex },
                classes: {
                  input: isBlackBg ? classes.input : "",
                },
                style: {
                  background: isBlackBg ? "#2A2D34" : "",
                  color: isBlackBg ? "#fff" : "",
                },
              }}
            />
            </Tooltip>
          )}
        </InputMask>
      )}
    ></Controller>
  );
};

export default HFTextFieldWithMask;
