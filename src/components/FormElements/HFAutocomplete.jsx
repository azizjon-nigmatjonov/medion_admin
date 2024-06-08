import { FormControl, FormHelperText, InputLabel, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import CAutoCompleteSelect from "../CAutoCompleteSelect";

const HFAutocomplete = ({
  control,
  name,
  isBlackBg,
  label,
  tabIndex,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  rules = {},
  defaultValue = null,
  field,
  ...props
}) => {
  const computedOptions = useMemo(() => {
    if (Object.keys(options[0] ?? {}).includes("label")) {
      return options;
    }
    return options?.map((option) => ({
      label: option,
      value: option,
    }));
  }, [options]);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({
        field: { onChange: onFormChange, value, name },
        fieldState: { error },
      }) => {
        return (
          <FormControl style={{ width }}>
            <InputLabel size="small">{label}</InputLabel>
            <Tooltip title={field?.attributes?.showTooltip && field?.attributes?.tooltipText}>
            <CAutoCompleteSelect
              value={value}
              tabIndex={tabIndex}
              isBlackBg={isBlackBg}
              onChange={(val) => {
                onChange(val?.value);
                onFormChange(val?.value);
              }}
              options={computedOptions}
            />
            </Tooltip>
            {!disabledHelperText && error?.message && (
              <FormHelperText error>{error?.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    ></Controller>
  );
};

export default HFAutocomplete;
