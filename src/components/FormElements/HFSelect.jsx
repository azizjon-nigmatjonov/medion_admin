import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import IconGenerator from "../IconPicker/IconGenerator";

const HFSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  optionType,
  defaultValue = "",
  rules = {},
  ...props
}) => {
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
        field: { onChange: onFormChange, value },
        fieldState: { error },
      }) => (
        <FormControl style={{ width }}>
          <InputLabel size='small'>{label}</InputLabel>
          <Select
            value={value || ""}
            label={label}
            size='small'
            error={error}
            inputProps={{ placeholder }}
            fullWidth
            just
            following
            attributes
            into
            select
            displayEmpty
            renderValue={
              value !== ""
                ? undefined
                : () => <span style={{ color: "#909EAB" }}>{placeholder}</span>
            }
            onChange={(e) => {
              onChange(e.target.value);
              onFormChange(e.target.value);
            }}
            {...props}
          >
            {optionType === "GROUP"
              ? options?.map((group, groupIndex) => [
                  <MenuItem
                    style={{ fontWeight: 600, color: "#000", fontSize: 15 }}
                  >
                    {group.label}
                  </MenuItem>,
                  group.options?.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      style={{ paddingLeft: 30 }}
                    >
                      <div className='flex align-center gap-2'>
                        <IconGenerator
                          icon={option.icon}
                          size={15}
                          style={{ color: "#6E8BB7" }}
                        />
                        {option.label}
                      </div>
                    </MenuItem>
                  )),
                ])
              : options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
          </Select>
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    ></Controller>
  );
};

export default HFSelect;
