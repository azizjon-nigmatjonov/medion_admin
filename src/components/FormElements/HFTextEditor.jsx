import { lazy, Suspense } from "react"
import { Controller, useWatch } from "react-hook-form"

import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper"
import "react-quill/dist/quill.snow.css"


const ReactQuill = lazy(() => import("react-quill"))

const HFTextEditor = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  tabIndex,
  rules = {},
  field,
  ...props
}) => {
  const value = useWatch({
    control,
    name,
  })

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, ref }, fieldState: { error } }) => (
        <Suspense fallback={<RingLoaderWithWrapper />}>
          <ReactQuill
            theme="snow"
            defaultValue={value}
            onChange={onChange}
            tabIndex={tabIndex}
            autoFocus={false}
          />
        </Suspense>
        // <TextField
        //   size="small"
        //   value={value}
        //   onChange={(e) =>
        //     onChange(withTrim ? e.target.value?.trim() : e.target.value)
        //   }
        //   name={name}
        //   error={error}
        //   fullWidth={fullWidth}
        //   helperText={!disabledHelperText && error?.message}
        //   {...props}
        // />
      )}
    ></Controller>
  )
}

export default HFTextEditor
