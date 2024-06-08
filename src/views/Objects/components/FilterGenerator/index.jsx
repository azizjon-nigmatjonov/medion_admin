import { TextField } from "@mui/material";
import { useMemo, useState } from "react";

import CSelect from "../../../../components/CSelect";
import TableColumnFilter from "../../../../components/TableColumnFilter";
import TableOrderingButton from "../../../../components/TableOrderingButton";
import DefaultFilter from "./DefaultFilter";
import RelationFilter from "./RelationFilter";
import FilterAutoComplete from "./FilterAutocomplete";
import DateFilter from "./DateFilter";

const FilterGenerator = ({
  field,
  name,
  filters = {},
  onChange,
  tableSlug,
}) => {
  const orderingType = useMemo(
    () => filters.order?.[name],
    [filters.order, name]
  );

  const onOrderingChange = (value) => {
    if (!value) return onChange(value, "order");
    const data = {
      [name]: value,
    };
    onChange(data, "order");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TableOrderingButton value={orderingType} onChange={onOrderingChange} />
      {/* <TableColumnFilter>
        <Filter
          field={field}
          name={name}
          filters={filters}
          onChange={onChange}
          tableSlug={tableSlug}
        />
      </TableColumnFilter> */}
    </div>
  );
};

export default FilterGenerator;

export const Filter = ({
  field = {},
  name,
  filters = {},
  onChange,
  tableSlug,
}) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const computedOptions = useMemo(() => {
    if (!field.attributes?.options) return [];
    return field.attributes.options.map((option) => {
      if (field.type === "PICK_LIST")
        return {
          value: option.value,
          label: option.value,
        };
      if (field.type === "MULTISELECT")
        return {
          value: option.value,
          label: option.label ?? option.value,
        };
    });
  }, [field.attributes?.options, field.type]);

  if (field.type === "LOOKUP" || field.type === "LOOKUPS")
    return (
      <RelationFilter
        field={field}
        filters={filters}
        onChange={onChange}
        name={name}
        tableSlug={tableSlug}
      />
    );

  switch (field.type) {
    case "PICK_LIST":
    case "MULTISELECT":
      return (
        <FilterAutoComplete
          searchText={debouncedValue}
          setSearchText={setDebouncedValue}
          options={computedOptions}
          value={filters[name] ?? []}
          onChange={(val) => onChange(val?.length ? val : null, name)}
          label={field.label}
          field={field}
        />

        // <FormControl style={{ width: "100%" }}>
        //   <CSelect
        //     value={filters[name] ?? ""}
        //     onChange={(e) => onChange(e.target.value, name)}
        //     size="small"
        //     fullWidth
        //     disabledHelperText
        //     options={computedOptions}
        //     placeholder={field.label}
        //   />
        // </FormControl>
      );

    case "PHOTO":
      return null;
      
    case 'DATE':
    case "DATE_TIME":
      return (
        <DateFilter
          value={filters[name]}
          onChange={(val) => onChange(val, name)}
        />
        // <DatePicker
        //   inputFormat="dd.MM.yyyy"
        //   mask="__.__.____"
        //   toolbarFormat="dd.MM.yyyy"
        //   value={filters[name] ?? ""}
        //   onChange={(val) => onChange(val, name)}
        //   renderInput={(params) => (
        //     <TextField
        //       {...params}
        //       error={false}
        //       style={{ width: "100%" }}
        //       size="small"
        //     />
        //   )}
        // />
      );

    case "NUMBER":
      return (
        <TextField
          fullWidth
          size="small"
          placeholder={field.label}
          type="number"
          value={filters[name] ?? ""}
          onChange={(e) => onChange(Number(e.target.value) || undefined, name)}
        />
      );

    case "SWITCH":
      return (
        <CSelect
          fullWidth
          placeholder={field.label}
          value={filters[name] ?? ""}
          disabledHelperText
          options={[
            {
              label: field.attributes?.text_true ?? "Да",
              value: "true",
            },
            {
              label: field.attributes?.text_false ?? "Нет",
              value: "false",
            },
          ]}
          onChange={(e) => onChange(e.target.value, name)}
        />
      );

    default:
      return (
        <DefaultFilter
          field={field}
          filters={filters}
          onChange={onChange}
          name={name}
          tableSlug={tableSlug}
        />
      );
  }
};
