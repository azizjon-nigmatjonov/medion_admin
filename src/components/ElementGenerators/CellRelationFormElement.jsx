import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { get } from "@ngard/tiny-get";
import { useEffect, useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLocation } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import CascadingElement from "./CascadingElement";
import RelationGroupCascading from "./RelationGroupCascading";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const CellRelationFormElement = ({
  isBlackBg,
  isFormEdit,
  control,
  name,
  disabled,
  placeholder,
  field,
  isLayout,
  disabledHelperText,
  setFormValue,
  index,
  defaultValue = null,
  relationfields,
}) => {
  const classes = useStyles();

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return field?.attributes?.cascading_tree_table_slug ? (
            <RelationGroupCascading
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={onChange}
            />
          ) : field?.attributes?.cascadings?.length > 2 ? (
            <CascadingElement
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={onChange}
              relationfields={relationfields}
            />
          ) : (
            <AutoCompleteElement
              disabled={disabled}
              isFormEdit={isFormEdit}
              placeholder={placeholder}
              isBlackBg={isBlackBg}
              value={value}
              classes={classes}
              name={name}
              setValue={onChange}
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              index={index}
              relationfields={relationfields}
            />
          );
        }}
      />
    );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  isFormEdit,
  placeholder,
  tableSlug,
  name,
  disabled,
  classes,
  isBlackBg,
  setValue,
  index,
  control,
  relationfields,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();
  const pathname = useLocation();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option);
  };

  const autoFilters = field?.attributes?.auto_filters;

  const autoFiltersFieldFroms = useMemo(() => {
    return autoFilters?.map((el) => `multi.${index}.${el.field_from}`) ?? [];
  }, [autoFilters, index]);

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

  const getIds = useMemo(() => {
    let val = [];
    relationfields
      ?.filter((item) => {
        return item[field?.slug];
      })
      .map((item) => {
        return val.push(item[field?.slug]);
      });
    return val;
  }, [relationfields, field]);

  const { data: options } = useQuery(
    ["GET_OBJECT_LIST", tableSlug, autoFiltersValue, debouncedValue],
    () => {
      let result = [];
      field.attributes?.view_fields?.forEach((el) => {
        if (el?.type === "LOOKUP") {
          result.push(el?.deep_view_fields?.map((i) => i.path_slug).join(""));
        }
      });
      if (result?.length)
        result = [...field?.view_fields?.map((f) => f.slug), ...result];
      else result = field?.view_fields?.map((f) => f.slug);
      return constructorObjectService.getList(tableSlug, {
        data: {
          ...autoFiltersValue,
          view_fields: result,
          limit: 10,
          additional_request: {
            additional_field: "guid",
            additional_values: getIds,
          },
          search: debouncedValue.trim(),
          input: true,
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
    const findedOption = options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  const changeHandler = (value) => {
    const val = value?.[value?.length - 1];

    setValue(val?.guid ?? null);
    setInputValue("");

    if (!field?.attributes?.autofill) return;

    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      const setName = name.split(".");
      setName.pop();
      setName.push(field_to);
      setFormValue(setName.join("."), get(val, field_from));
    });
  };

  useEffect(() => {
    const val = computedValue[computedValue.length - 1];
    if (!field?.attributes?.autofill || !val) return;
    field.attributes.autofill.forEach(({ field_from, field_to, automatic }) => {
      const setName = name.split(".");
      setName.pop();
      setName.push(field_to);
      automatic &&
        setTimeout(() => {
          setFormValue(setName.join("."), get(val, field_from));
        }, 1);
    });
  }, [computedValue]);

  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        inputValue={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          if (reason !== "reset") {
            setInputValue(newInputValue);
            inputChangeHandler(newInputValue);
          }
        }}
        disabled={disabled}
        options={options ?? []}
        value={computedValue}
        popupIcon={
          isBlackBg ? (
            <ArrowDropDownIcon style={{ color: "#fff" }} />
          ) : (
            <ArrowDropDownIcon />
          )
        }
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
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) => getRelationFieldTabsLabel(field, option)}
        multiple
        onPaste={(e) => {}}
        // isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => (
          <TextField
            className={`${isFormEdit ? "custom_textfield" : ""}`}
            placeholder={!computedValue.length ? placeholder : ""}
            {...params}
            InputProps={{
              ...params.InputProps,
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: {
                background: isBlackBg ? "#2A2D34" : "",
                color: isBlackBg ? "#fff" : "",
              },
            }}
            size="small"
          />
        )}
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
    </div>
  );
};

export default CellRelationFormElement;
