import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { get } from "@ngard/tiny-get";
import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CascadingElement from "./CascadingElement";
import { Close } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const CellManyToManyRelationElement = ({
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
  defaultValue,
  row,
}) => {
  const classes = useStyles();
  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return field?.attributes?.cascadings?.length > 2 ? (
            <CascadingElement
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              control={control}
              setValue={onChange}
              value={value}
              setFormValue={setFormValue}
              row={row}
              index={index}
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
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();

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

  const { data: options } = useQuery(
    [
      "GET_OBJECT_LIST",
      tableSlug.includes("doctors_") ? "doctors" : tableSlug,
      autoFiltersValue,
    ],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: autoFiltersValue,
      });
    },
    {
      select: (res) => {
        return res?.data?.response ?? [];
      },
    }
  );

  const computedValue = useMemo(() => {
    if (!value) return [];

    return value
      ?.map((id) => {
        const option = options?.find((el) => el?.guid === id);

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
    const val = value?.map((el) => el.guid);

    setValue(val ?? null);

    // if (!field?.attributes?.autofill) return;

    // field.attributes.autofill.forEach(({ field_from, field_to }) => {
    //   const setName = name.split(".");
    //   setName.pop();
    //   setName.push(field_to);
    //   setFormValue(setName.join("."), get(val, field_from));
    // });
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
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
        getOptionLabel={(option) =>
          getRelationFieldTabsLabel(field, option, true)
        }
        multiple
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
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

export default CellManyToManyRelationElement;
