import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";
import ImageUpload from "../Upload/ImageUpload";
import VideoUpload from "../Upload/VideoUpload";

const HFVideoUpload = ({
  control,
  name,
  required,
  tabIndex,
  rules,
  disabledHelperText = false,
  disabled,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <VideoUpload
            name={name}
            value={value}
            onChange={onChange}
            tabIndex={tabIndex}
            disabled={disabled}
            // error={get(formik.touched, name) && Boolean(get(formik.errors, name))}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}
    ></Controller>
  );
};

export default HFVideoUpload;
