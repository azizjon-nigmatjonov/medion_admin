import { Clear } from "@mui/icons-material"
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material"
import { useId, useMemo } from "react"
import { listToMap } from "../../utils/listToMap"
import styles from "./style.module.scss"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const CMultipleSelect = ({
  name,
  items = [],
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  value,
  onChange = () => {},
  error,
  ...props
}) => {
    const optionsMap = useMemo(() => {
    return listToMap(options, "value")
  }, [options])

  const id = useId()

  return (
    <FormControl style={{ width }}>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        labelId={`multiselect-${id}-label`}
        id={`multiselect-${id}`}
        multiple
        displayEmpty
        value={Array.isArray(value) ? value : []}
        
        onChange={onChange}
        input={
          <OutlinedInput error={error} size="small" id={`multiselect-${id}`} />
        }
        endAdornment={
          <IconButton
            sx={{ display: value?.length ? "" : "none", transform: 'translateX(-5px)' }}
            onClick={e => onChange({ ...e, target: { value: [] }})}
          >
            <Clear />
          </IconButton>
        }
        renderValue={(selected) => {
          if (!selected?.length) {
            return <span className={styles.placeholder}>{placeholder}</span>
          }

          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected?.map((value) => (
                <div key={value} className={styles.tag}>
                  {optionsMap[value]?.label ?? value}
                </div>
              ))}
            </Box>
          )
        }}
        MenuProps={MenuProps}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </FormControl>
  )
}

export default CMultipleSelect
