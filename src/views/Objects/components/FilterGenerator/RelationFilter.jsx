import { useState } from "react";
import useObjectsQuery from "../../../../queries/hooks/useObjectsQuery";

import { getRelationFieldTabsLabel } from "../../../../utils/getRelationFieldLabel";
import FilterAutoComplete from "./FilterAutocomplete";

const RelationFilter = ({ field = {}, filters, name, onChange }) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  const value = filters[name];

  const {
    query: { data: options = [] },
  } = useObjectsQuery({
    tableSlug: field.table_slug,
    queryPayload: {
      view_fields: field?.view_fields?.map((field) => field.slug),
      search: debouncedValue,
      limit: 10,
      additional_ids: value,
    },
    queryParams: {
      select: (res) => {
        return (
          res?.data?.response?.map((el) => ({
            label: getRelationFieldTabsLabel(field, el),
            value: el.guid,
          })) ?? []
        );
      },
      // onSuccess: (res) => {
      //   setOptions()
      // },
    },
  });

  return (
    <FilterAutoComplete
      searchText={debouncedValue}
      setSearchText={setDebouncedValue}
      value={value ?? []}
      onChange={(val) => {
        onChange(val?.length ? val : undefined, name);
      }}
      options={options}
      label={field.label}
    />
  );
};

export default RelationFilter;
