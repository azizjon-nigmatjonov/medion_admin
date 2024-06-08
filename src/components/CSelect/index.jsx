import { Clear } from "@mui/icons-material"
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"

const CSelect = ({
  label,
  value,
  error,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  inputProps = {},
  onChange = () => {},
  ...props
}) => {
  return (
    <FormControl style={{ width, }}>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        value={value || ""}
        label={label}
        size="small"
        error={error}
        inputProps={{ placeholder, ...inputProps }}
        fullWidth
        just
        following
        attributes
        into
        select
        displayEmpty
        onChange={onChange}
        renderValue={value !== "" ? undefined : () => <span style={{ color: '#909EAB' }} >{placeholder}</span>}
        endAdornment={
          <IconButton
            sx={{ display: value ? "" : "none", transform: 'translateX(10px)' }}
            onClick={e => onChange({ ...e, target: { value: "" } })}
          >
            <Clear />
          </IconButton>
        }
        sx={{
          "& .MuiSelect-iconOutlined": { display: value ? "none" : "" },
          "&.Mui-focused .MuiIconButton-root": { color: "primary.main" },
        }}
        {...props}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!disabledHelperText && (
        <FormHelperText error>{error?.message ?? " "}</FormHelperText>
      )}
    </FormControl>
  )
}

export default CSelect
