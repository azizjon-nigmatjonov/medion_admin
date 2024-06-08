import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { getValue } from "@mui/system";
import { get } from "@ngard/tiny-get";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import useDebounce from "../../hooks/useDebounce";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel";
import FEditableRow from "../FormElements/FEditableRow";
import FRow from "../FormElements/FRow";
import IconGenerator from "../IconPicker/IconGenerator";
import CascadingElement from "./CascadingElement";
import CascadingSection from "./CascadingSection/CascadingSection";
import GroupCascading from "./GroupCascading/index";
import styles from "./style.module.scss";

const RelationFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  column,
  name = "",
  mainForm,
  disabledHelperText,
  setFormValue,
  formTableSlug,
  disabled = false,
  defaultValue = null,
  multipleInsertField,
  ...props
}) => {
  const tableSlug = useMemo(() => {
    if (field.relation_type === "Recursive") return formTableSlug;
    return field.id.split("#")?.[0] ?? "";
  }, [field.id, formTableSlug, field.relation_type]);

  if (!isLayout)
    return (
      <FRow label={field?.label ?? field?.title} required={field.required}>
        <Controller
          control={control}
          name={(name || field.slug) ?? `${tableSlug}_id`}
          defaultValue={defaultValue}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AutoCompleteElement
              value={Array.isArray(value) ? value[0] : value}
              setValue={onChange}
              field={field}
              disabled={disabled}
              tableSlug={tableSlug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              name={name}
              multipleInsertField={multipleInsertField}
            />
          )}
        />
      </FRow>
    );

  return (
    <Controller
      control={mainForm.control}
      name={`sections[${sectionIndex}].fields[${fieldIndex}].field_name`}
      defaultValue={field.label}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FEditableRow
          label={value}
          onLabelChange={onChange}
          required={field.required}
        >
          <Controller
            control={control}
            name={`${tableSlug}_id`}
            defaultValue={defaultValue}
            render={({ field: { onChange, value }, fieldState: { error } }) =>
              field?.attributes?.cascadings?.length === 2 ? (
                <CascadingElement
                  field={field}
                  tableSlug={tableSlug}
                  error={error}
                  disabledHelperText={disabledHelperText}
                  control={control}
                  setValue={onChange}
                  value={Array.isArray(value) ? value[0] : value}
                  name={name}
                />
              ) : (
                <AutoCompleteElement
                  value={Array.isArray(value) ? value[0] : value}
                  setValue={onChange}
                  field={field}
                  disabled={disabled}
                  tableSlug={tableSlug}
                  error={error}
                  disabledHelperText={disabledHelperText}
                  control={control}
                  name={name}
                />
              )
            }
          />
        </FEditableRow>
      )}
    ></Controller>
  );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  tableSlug,
  setValue,
  error,
  disabled,
  disabledHelperText,
  control,
  name,
  multipleInsertField,
  setFormValue = () => {},
}) => {
  const [inputValue, setInputValue] = useState("");
  const [localValue, setLocalValue] = useState([]);
  const { id } = useParams();
  const validId = id ? [id] : [];
  const [debouncedValue, setDebouncedValue] = useState("");
  const { navigateToForm } = useTabRouter();
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const autoFilters = field?.attributes?.auto_filters;

  const autoFiltersFieldFroms = useMemo(() => {
    return autoFilters?.map((el) => el.field_from) ?? [];
  }, [autoFilters]);

  const filtersHandler = useWatch({
    control,
    name: autoFiltersFieldFroms,
  });

  const autoFiltersValue = useMemo(() => {
    const result = {};
    filtersHandler?.forEach((value, index) => {
      const key = autoFilters?.[index]?.field_to;
      if (key) result[key] = value;
    });
    return result;
  }, [autoFilters, filtersHandler]);

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST", tableSlug, debouncedValue, autoFiltersValue],
    () => {
      if (!tableSlug) return null;
      let result = [];
      field.attributes?.view_fields?.forEach((el) => {
        if (el?.type === "LOOKUP") {
          result = el?.deep_view_fields?.map((i) => i.path_slug);
        }
      });
      if (result?.length)
        result = [
          ...field.attributes?.view_fields?.map((f) => f.slug),
          ...result,
        ];
      else result = field.attributes?.view_fields?.map((f) => f.slug);

      return constructorObjectService.getList(tableSlug, {
        data: {
          ...autoFiltersValue,
          additional_request: {
            additional_field: "guid",
            additional_values: validId,
          },
          view_fields: result,
          search: debouncedValue.trim(),
          limit: 10,
          input: true,
        },
      });
    },
    {
      select: (res) => {
        const options = res?.data?.response ?? [];
        const slugOptions =
          res?.table_slug === tableSlug ? res?.data?.response : [];

        return {
          options,
          slugOptions,
        };
      },
    }
  );

  const getValueData = async () => {
    try {
      const id = value;
      const res = await constructorObjectService.getById(tableSlug, id);
      const data = res?.data?.response;
      if (data.balance) {
        setFormValue("balance", data.balance || 0);
      }
      setValue(data?.guid ?? null);
      setLocalValue(data ? [data] : null);
    } catch (error) {}
  };

  const getOptionLabel = (option) => {
    return getRelationFieldLabel(field, option);
  };
  const computedValue = useMemo(() => {
    const findedOption = options?.options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  const setDefaultValue = () => {
    if (options?.slugOptions && multipleInsertField) {
      const val = options?.slugOptions?.find((item) => item?.guid === id);
      setValue(val?.guid ?? null);
      setLocalValue(val ? [val] : null);
    }
  };

  const changeHandler = (value, key = "") => {
    if (key === "cascading") {
      setValue(value?.guid ?? value?.guid);
      setLocalValue(value ? [value] : null);
      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({ field_from, field_to }) => {
        setFormValue(field_to, get(value, field_from));
      });
    } else {
      const val = value?.[value?.length - 1];
      setValue(val?.guid ?? null);
      setLocalValue(val ? [val] : null);

      if (!field?.attributes?.autofill) return;

      field.attributes.autofill.forEach(({ field_from, field_to }) => {
        setFormValue(field_to, get(val, field_from));
      });
    }
  };

  useEffect(() => {
    const val = computedValue[computedValue.length - 1];
    if (!field?.attributes?.autofill || !val) return;
    field.attributes.autofill.forEach(({ field_from, field_to, automatic }) => {
      const setName = name?.split(".");
      setName?.pop();
      setName?.push(field_to);
      automatic &&
        setTimeout(() => {
          setFormValue(setName.join("."), get(val, field_from));
        }, 1);
    });
  }, [computedValue, field]);

  useEffect(() => {
    if (value) getValueData();
  }, [value]);

  useEffect(() => {
    setDefaultValue();
  }, [options, multipleInsertField]);

  return (
    <div className={styles.autocompleteWrapper}>
      <div
        className={styles.createButton}
        onClick={() => navigateToForm(tableSlug)}
      >
        Создать новый
      </div>
      {field?.attributes?.cascadings?.length > 2 ? (
        <CascadingSection
          field={field}
          tableSlug={tableSlug}
          error={error}
          disabledHelperText={disabledHelperText}
          value={localValue ?? []}
          setValue={(newValue) => {
            changeHandler(newValue, "cascading");
          }}
          onInputChange={(e, newValue) => {
            setInputValue(newValue);
            inputChangeHandler(newValue);
          }}
        />
      ) : field?.attributes?.cascading_tree_table_slug ? (
        <GroupCascading
          field={field}
          tableSlug={tableSlug}
          error={error}
          disabledHelperText={disabledHelperText}
          value={localValue ?? []}
          setFormValue={setFormValue}
          setValue={(newValue) => {
            changeHandler(newValue, "cascading");
          }}
          onInputChange={(e, newValue) => {
            setInputValue(newValue);
            inputChangeHandler(newValue);
          }}
        />
      ) : (
        <Tooltip
          title={
            field?.attributes?.showTooltip && field?.attributes?.tooltipText
          }
        >
          <Autocomplete
            disabled={disabled}
            options={options?.options ?? []}
            value={localValue ?? []}
            freeSolo
            onChange={(event, newValue) => {
              changeHandler(newValue);
            }}
            noOptionsText={
              <span
                onClick={() => navigateToForm(tableSlug)}
                style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}
              >
                Создать новый
              </span>
            }
            inputValue={inputValue}
            onInputChange={(e, newValue) => {
              setInputValue(newValue ?? null);
              inputChangeHandler(newValue);
            }}
            disablePortal
            blurOnSelect
            openOnFocus
            getOptionLabel={(option) => getRelationFieldLabel(field, option)}
            multiple
            isOptionEqualToValue={(option, value) => {
              return option.guid === value.guid;
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
            renderTags={(value, index) => (
              <>
                {getOptionLabel(value[0])}
                <IconGenerator
                  icon="arrow-up-right-from-square.svg"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  size={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigateToForm(tableSlug, "EDIT", value[0]);
                  }}
                />
              </>
            )}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default RelationFormElement;
