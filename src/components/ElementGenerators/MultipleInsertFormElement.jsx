import { Close } from "@mui/icons-material";
import { Autocomplete, TextField } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import useDebounce from "../../hooks/useDebounce";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel";
import FEditableRow from "../FormElements/FEditableRow";
import FRow from "../FormElements/FRow";
import IconGenerator from "../IconPicker/IconGenerator";
import CascadingSection from "./CascadingSection/CascadingSection";
import styles from "./style.module.scss";

const MultipleInsertFormElement = ({
  control,
  field,
  isLayout,
  sectionIndex,
  fieldIndex,
  name = "",
  column,
  mainForm,
  disabledHelperText,
  autocompleteProps = {},
  disabled = false,
  setFormValue = () => {},
  ...props
}) => {
  const tableSlug = useMemo(() => {
    return field.id?.split("#")?.[0] ?? "";
  }, [field.id]);

  if (!isLayout)
    return (
      <FRow label={field.label} required={field.required}>
        <Controller
          control={control}
          name={name || `${tableSlug}_ids`}
          defaultValue={null}
          {...props}
          render={({ field: { onChange, value }, fieldState: { error } }) =>
            field?.attributes?.cascadings?.length > 1 ? (
              <CascadingSection
                disabled={disabled}
                value={value}
                name={name}
                setValue={onChange}
                field={field}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
                control={control}
              />
            ) : (
              <AutoCompleteElement
                value={value}
                setValue={onChange}
                field={field}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
                control={control}
                setFormValue={setFormValue}
                {...autocompleteProps}
              />
            )
          }
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
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AutoCompleteElement
                disabled={disabled}
                value={value}
                setValue={onChange}
                field={field}
                tableSlug={tableSlug}
                error={error}
                disabledHelperText={disabledHelperText}
                control={control}
                setFormValue={setFormValue}
              />
            )}
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
  control,
  error,
  disabled,
  disabledHelperText,
  setFormValue,
}) => {
  const { navigateToForm } = useTabRouter();
  const [debouncedValue, setDebouncedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputChangeHandler = useDebounce((val) => {
    setDebouncedValue(val);
  }, 300);

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
    ["GET_OBJECT_LIST", tableSlug, autoFiltersValue, debouncedValue],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          ...autoFiltersValue,
          view_fields:
            field?.view_fields?.map((field) => field.slug) ??
            field?.attributes?.view_fields?.map((field) => field.slug),
          additional_request: {
            additional_field: "guid",
            additional_values: value,
          },
          // additional_ids: value,
          search: debouncedValue,
          limit: 10,
        },
      });
    },
    {
      select: (res) => {
        return res?.data?.response ?? [];
      },
    }
  );

  const computedValue = useMemo(() => {
    if (!value) return undefined;

    return value
      ?.map((id) => {
        const option = options?.find((el) => el?.guid === id);

        if (!option) return null;
        return {
          ...option,
        };
      })
      ?.filter((el) => el);
  }, [value, options]);

  const getOptionLabel = (option) => {
    // return ''
    return getRelationFieldLabel(field, option);
  };

  const changeHandler = (value) => {
    if (!value) setValue(null);

    const val = value?.map((el) => el.guid);

    setValue(val ?? null);

    if (!field?.attributes?.autofill) return;

    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      const computedValue = value.map((row) => get(row, field_from));
      setFormValue(`autofill#${field_to}`, computedValue);
    });
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <div
        className={styles.createButton}
        onClick={() => navigateToForm(tableSlug)}
      >
        Создать новый
      </div>

      <Autocomplete
        disabled={disabled}
        options={options ?? []}
        value={computedValue}
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
        onInputChange={(_, val) => {
          setInputValue(val);
          inputChangeHandler(val);
        }}
        disablePortal
        clearOnBlur={!inputValue}
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) => getRelationFieldLabel(field, option)}
        multiple
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => <TextField {...params} size="small" />}
        renderTags={(values, getTagProps) => {
          return (
            <>
              <div className={styles.valuesWrapper}>
                {values?.map((el, index) => (
                  <div
                    key={el.value}
                    className={styles.multipleAutocompleteTags}
                  >
                    <p className={styles.value}>
                      {getOptionLabel(values[index])}
                    </p>
                    <IconGenerator
                      icon="arrow-up-right-from-square.svg"
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      size={15}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigateToForm(tableSlug, "EDIT", values[index]);
                      }}
                    />

                    <Close
                      fontSize="12"
                      onClick={getTagProps({ index })?.onDelete}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default MultipleInsertFormElement;
