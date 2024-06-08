import { Controller } from "react-hook-form"
import AvatarUpload from "../AvatarUpload"

const HFAvatarUpload = ({ control, name, required, rules, ...props }) => {
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
        <AvatarUpload
          size="small"
          value={value}
          name={name}
          onChange={onChange}
          error={error}
          {...props}
        />
      )}
    ></Controller>
  )
}

export default HFAvatarUpload
