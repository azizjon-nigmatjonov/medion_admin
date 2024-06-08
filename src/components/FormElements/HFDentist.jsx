import { Dialog, InputAdornment, TextField, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { numberWithSpaces } from "@/utils/formatNumbers";
import { useState } from "react";
import DentistComponent from "../ElementGenerators/Dentist";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDentist = ({
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
  ...props
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
         <Tooltip title={field?.attributes?.showTooltip && field?.attributes?.tooltipText}>
           <TextField
            size="small"
            value={typeof value === "number" ? numberWithSpaces(value) : value}
            onChange={(e) => {}}
            name={name}
            error={error}
            fullWidth={fullWidth}
            placeholder={placeholder}
            autoFocus={tabIndex === 1}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  sx={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                  }}
                  position="end"
                >
                  <VisibilityIcon />
                </InputAdornment>
              ),
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
            {...props}
          />
         </Tooltip>
        )}
      />

      <Dialog fullWidth maxWidth={!type ? 'xl' : 'md'} open={open} onClose={handleClose}>
        <DentistComponent type={type} setType={setType} onClose={handleClose} />
      </Dialog>
    </>
  );
};

export default HFDentist;
