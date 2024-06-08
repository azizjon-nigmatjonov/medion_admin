import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import CDatePicker from "../DatePickers/CDatePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDatePicker = ({
  control,
  isBlackBg = false,
  className,
  name,
  label,
  width,
  mask,
  tabIndex,
  inputProps,
  disabledHelperText,
  placeholder = "",
  isFormEdit = false,
  defaultValue = "",
  disabled,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      disabled
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={className}>
          <CDatePicker
            isFormEdit={isFormEdit}
            name={name}
            classes={classes}
            placeholder={placeholder}
            isBlackBg={isBlackBg}
            mask={mask}
            tabIndex={tabIndex}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      )}
    />
  );
};

export default HFDatePicker;
