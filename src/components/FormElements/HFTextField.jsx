import { TextField, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";

import { numberWithSpaces } from "@/utils/formatNumbers";
import PDFReader from "../PDFReader";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTextField = ({
  control,
  name = "",
  isFormEdit = false,
  isBlackBg,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  tabIndex,
  placeholder,
  field,
  type,
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
        <div style={{ position: "relative" }}>
          <Tooltip
            title={
              field?.attributes?.showTooltip
                ? field?.attributes?.tooltipText
                : ""
            }
          >
            <TextField
              size="small"
              value={
                typeof value === "number" ? numberWithSpaces(value) : value
              }
              onChange={(e) => {
                onChange(
                  withTrim
                    ? e.target.value?.trim()
                    : typeof e.target.value === "number"
                    ? numberWithSpaces(e.target.value)
                    : e.target.value
                );
              }}
              name={name}
              error={error}
              fullWidth={fullWidth}
              placeholder={placeholder}
              autoFocus={tabIndex === 1}
              InputProps={{
                readOnly: disabled,
                inputProps: { tabIndex },
                classes: {
                  input: isBlackBg ? classes.input : "",
                },
                style: disabled
                  ? {
                      background: "#c0c0c039",
                    }
                  : {
                      background: isBlackBg ? "#2A2D34" : "inherit",
                      color: isBlackBg ? "#fff" : "inherit",
                    },
              }}
              helperText={!disabledHelperText && error?.message}
              className={isFormEdit ? "custom_textfield" : ""}
              type={type}
              {...props}
            />
          </Tooltip>
          {type === "PDF_READER" ? (
            <div
              style={{
                textAlign: "center",
                position: "absolute",
                top: "50%",
                right: "0px",
                transform: "translateY(-50%)",
              }}
            >
              <PDFReader
                value={
                  typeof value === "number" ? numberWithSpaces(value) : value
                }
              />
            </div>
          ) : null}
        </div>
      )}
    />
  );
};

export default HFTextField;
