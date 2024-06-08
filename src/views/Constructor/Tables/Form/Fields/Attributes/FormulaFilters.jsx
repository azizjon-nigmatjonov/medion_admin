import { Close, Delete } from "@mui/icons-material";
import { Autocomplete, Checkbox, FormControl, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import RectangleIconButton from "../../../../../../components/Buttons/RectangleIconButton";
import CAutoCompleteSelect from "../../../../../../components/CAutoCompleteSelect";
import HFAutocomplete from "../../../../../../components/FormElements/HFAutocomplete";
import HFMultipleAutocomplete from "../../../../../../components/FormElements/HFMultipleAutocomplete";
import HFMultipleSelect from "../../../../../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../../../components/FormElements/HFSwitch";
import IconGenerator from "../../../../../../components/IconPicker/IconGenerator";
import useDebounce from "../../../../../../hooks/useDebounce";
import useTabRouter from "../../../../../../hooks/useTabRouter";
import constructorObjectService from "../../../../../../services/constructorObjectService";
import styles from "./style.module.scss";

function FormulaFilters({
  summary,
  control,
  deleteSummary,
  index,
  selectedTableSlug,
}) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const filterKey = useWatch({
    control,
    name: `attributes.formula_filters.${index}.key`,
  });

  const selectedType = filterKey?.split("#")?.[1];
  const selectedSlug =
    selectedType === "LOOKUP" || selectedType === "LOOKUPS"
      ? filterKey?.split("#")?.[2]
      : "";

  //==============GET OPTIONS FOR KEY============
  const { data: fields = [] } = useQuery(
    ["GET_OBJECT_LIST", selectedTableSlug],
    () => {
      return constructorObjectService.getList(selectedTableSlug, {
        data: {
          limit: 0,
          offset: 0,
        },
      });
    },
    {
      enabled: !!selectedTableSlug,
      select: (res) => {
        return res?.data?.fields.filter((item) => {
          return (
            item?.type === "LOOKUP" ||
            item?.type === "LOOKUPS" ||
            item?.type === "MULTISELECT" ||
            item?.type === "SWITCH" ||
            item?.type === "CHECKBOX"
          );
        });
      },
    }
  );

  //===========COMPUTE VIEWFIELD SLUG============
  const viewFieldsSlug = useMemo(() => {
    if (
      filterKey?.split("#")?.[1] !== "LOOKUP" &&
      filterKey?.split("#")?.[1] !== "LOOKUPS"
    )
      return false;

    const filterField = fields
      .find((item) => filterKey?.split("#")?.[0] === item?.slug)
      ?.view_fields?.map((item) => {
        return item?.slug;
      });
    return filterField;
  }, [fields, filterKey]);

  //==============GET OPTIONS FOR VALUE============
  const { data: filtersValue = [] } = useQuery(
    ["GET_OBJECT_LIST", selectedSlug, debouncedValue],
    () => {
      return constructorObjectService.getList(selectedSlug, {
        data: {
          limit: 10,
          offset: 0,
          view_fields: viewFieldsSlug,
          search: debouncedValue,
        },
      });
    },
    {
      enabled: !!selectedSlug,
      select: (res) => {
        return res?.data?.response.map((item) => ({
          label: viewFieldsSlug.map((el) => item?.[el] + " "),
          value: item?.guid ?? "",
        }));
      },
    }
  );

  //================COMPUTE KEY OPTIONS===========
  const computedFilterOptions = useMemo(() => {
    const value = fields?.map((item) => ({
      label: item?.label ?? "",
      value: `${item?.slug}#${item?.type}#${item?.table_slug ?? ""}`,
    }));
    return value;
  }, [fields]);

  //================COMPUTE KEY OPTIONS FOR MULTISELECT TYPE===========
  const computedMultiselect = useMemo(() => {
    const status = filterKey?.split("#")?.[0];
    const value = fields
      ?.filter((item) => {
        return item?.type === "MULTISELECT" && item?.slug === status;
      })
      .find((el) => el?.attributes?.options)?.attributes?.options;
    const computeOption =
      value &&
      value?.map((el) => ({
        label: el?.label ?? "",
        value: el?.value ?? "",
      }));
    return computeOption;
  }, [fields, filterKey]);

  return (
    <div className={styles.actionSettingBlock}>
      <div key={summary.key} className={styles.filterActions}>
        <div className={styles.filtersBody}>
          <div className={styles.filtersBodyItem}>
            <HFSelect
              control={control}
              name={`attributes.formula_filters.${index}.key`}
              options={computedFilterOptions ?? []}
            />
          </div>
          <div className={styles.filtersBodyItemMain}>
            {selectedType === "LOOKUP" || selectedType === "LOOKUPS" ? (
              <Controller
                control={control}
                name={`attributes.formula_filters.${index}.value`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <AutoCompleteElement
                    value={value}
                    options={filtersValue}
                    setValue={onChange}
                    error={error}
                    control={control}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    setDebouncedValue={setDebouncedValue}
                  />
                )}
              />
            ) : selectedType === "SWITCH" || selectedType === "CHECKBOX" ? (
              <HFSwitch
                control={control}
                name={`attributes.formula_filters.${index}.value`}
              />
            ) : (
              <HFMultipleSelect
                options={computedMultiselect}
                control={control}
                name={`attributes.formula_filters.${index}.value`}
              />
            )}
          </div>
          <div className={styles.deleteBtn}>
            <RectangleIconButton
              color="error"
              onClick={() => deleteSummary(index)}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  value,
  setValue,
  options,
  inputValue,
  setInputValue,
  setDebouncedValue,
}) => {
  const { navigateToForm } = useTabRouter();

  const computedValue = useMemo(() => {
    if (!value) return undefined;

    return value
      ?.map((id) => {
        const option = options?.find((el) => el?.value === id);

        if (!option) return null;
        return {
          ...option,
          // label: getRelationFieldLabel(field, option)
        };
      })
      ?.filter((el) => el);
  }, [options, value]);

  const changeHandler = (value) => {
    if (!value) setValue(null);

    const val = value?.map((el) => el.value);

    setValue(val ?? null);
  };
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        multiple
        limitTags={1}
        disableCloseOnSelect
        size="small"
        inputValue={inputValue}
        value={computedValue}
        options={options}
        listStyle={{ maxHeight: 200, overflow: "auto" }}
        getOptionLabel={(option) => option.label}
        onChange={(e, values) => {
          changeHandler(values);
        }}
        onInputChange={(_, val) => {
          inputChangeHandler(val);

          setInputValue(val);
        }}
        renderInput={(params) => <TextField size="small" {...params} />}
      />
    </div>
  );
};

export default FormulaFilters;
