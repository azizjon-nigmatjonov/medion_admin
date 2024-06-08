import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";

const FiltersAutocomplete = ({ options, value, onChange, tabIndex }) => {
  const computedValue = useMemo(() => {
    return options?.find((option) => option?.value === value) ?? null;
  }, [options, value]);

  return (
    <div>
      <Autocomplete
        // disablePortal
        multiple
        options={options}
        value={computedValue}
        onChange={(e, value) => onChange(value)}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        // sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            // autoFocus={tabIndex === 1}
            // InputProps={{ inputProps: { tabIndex } }}
            size="small"
          />
        )}
      />
    </div>
  );
};

export default FiltersAutocomplete;
