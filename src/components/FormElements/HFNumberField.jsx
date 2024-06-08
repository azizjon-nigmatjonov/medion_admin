import { TextField, Tooltip } from "@mui/material";
import { Controller } from "react-hook-form";

function formatNumber(value) {
  const inputValue = parseInt(value, 10);
  if (!isNaN(inputValue)) {
    const formattedNumber = inputValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return formattedNumber;
  }
}

const HFNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  type = "text",
  fields,
  ...props
}) => {
  // const value = useWatch({
  //   control,
  //   // name,
  // });

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
        <Tooltip
          title={
            fields?.attributes?.showTooltip && fields?.attributes?.tooltipText
          }
        >
          <TextField
            size="small"
            value={formatNumber(value)}
            onChange={(e) => {
              let formattedValue = e.target.value;

              if (e.target.value.startsWith("-")) {
                formattedValue =
                  "-" + e.target.value.substring(1).replace(/[^0-9]/g, "");
              } else {
                formattedValue = e.target.value.replace(/[^0-9]/g, "");
              }
              onChange(formattedValue ? Number(formattedValue) : "");
            }}
            className={`${isFormEdit ? "custom_textfield" : ""}`}
            name={name}
            error={error}
            fullWidth={fullWidth}
            helperText={!disabledHelperText && error?.message}
            autoFocus={tabIndex === 1}
            InputProps={{
              inputProps: { tabIndex },
              readOnly: disabled,
              style: disabled
                ? {
                    background: "#c0c0c039",
                  }
                : {
                    background: isBlackBg ? "#2A2D34" : "",
                    color: isBlackBg ? "#fff" : "",
                  },
            }}
            {...props}
          />
        </Tooltip>
      )}
    ></Controller>
  );
};

export default HFNumberField;
