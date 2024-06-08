import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import CDateTimePicker from "../DatePickers/CDateTimePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDateTimePicker = ({
  control,
  isBlackBg = false,
  isFormEdit = false,
  name,
  mask,
  tabIndex,
  showCopyBtn,
  placeholder = "",
  disabled,
  defaultValue,
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <CDateTimePicker
            isFormEdit={isFormEdit}
            classes={classes}
            placeholder={placeholder}
            isBlackBg={isBlackBg}
            mask={mask}
            tabIndex={tabIndex}
            value={value}
            showCopyBtn={showCopyBtn}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }}
    ></Controller>
  );
};

export default HFDateTimePicker;
