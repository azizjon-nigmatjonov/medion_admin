import React, { useEffect, useMemo, useState } from "react";
import styles from "./style.module.scss";
import { Autocomplete, Drawer, InputAdornment, TextField } from "@mui/material";
import CascadingItem from "./CascadingItem";
import constructorObjectService from "../../services/constructorObjectService";
import IconGenerator from "../IconPicker/IconGenerator";
import useTabRouter from "../../hooks/useTabRouter";
import CloseIcon from "@mui/icons-material/Close";
import { getRelationFieldLabel } from "../../utils/getRelationFieldLabel";
import { useQuery } from "react-query";
import { get } from "@ngard/tiny-get";

function CascadingElement({
  setValue,
  field,
  setFormValue,
  tableSlug,
  value,
  row,
  index,
  name,
  relationfields,
  control,
}) {
  const [values, setValues] = useState();
  const [inputValue, setInputValue] = useState();
  const [title, setTitle] = useState("");
  const [secondTitle, setSecondTitle] = useState("");
  const { navigateToForm } = useTabRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [dataFilter, setDataFilter] = useState([]);
  const [tablesSlug, setTablesSlug] = useState([]);

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

  //==========OPTIONS REQUEST===========
  const { data: options } = useQuery(
    ["GET_OBJECT_LIST", tableSlug],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          view_fields:
            field?.view_fields?.map((field) => field.slug) ??
            field?.attributes?.view_fields?.map((field) => field.slug),
          additional_request: {
            additional_field: "guid",
            additional_values: getIds,
          },
          search: "",
          limit: 10,
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

  const computedData = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  //=========COMPUTED VALUE FOR LOOKUPS========
  const computedValue = useMemo(() => {
    if (field?.type === "LOOKUPS") {
      if (!value) return [];
      return value
        ?.map((id) => {
          const option = options?.find((el) => el?.guid === id);

          if (!option) return null;
          return {
            ...option,
          };
        })
        ?.filter((el) => el);
    }
  }, [options, value, field]);

  //==========COMPUTED VALUE FOR LOOKUP===========
  const insideValue = useMemo(() => {
    let values = "";
    if (!value) return "";
    const option = options?.find((el) => el?.guid === value);
    const slugs = field?.attributes?.view_fields?.map((i) => i.slug);

    if (inputValue === undefined) {
      slugs?.map(
        (item) => (values += option === undefined ? "" : " " + option?.[item])
      );
    } else {
      slugs?.map((item) => (values += " " + inputValue?.[item]));
    }
    return values;
  }, [field, options, inputValue, value]);

  //==========MAIN SETVALUE FUNCTION===========
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    constructorObjectService
      .getList(
        field?.attributes?.cascadings[field?.attributes?.cascadings?.length - 1]
          ?.table_slug,
        { data: {} }
      )
      .then((res) => {
        setValues(res?.data?.response);
        setTablesSlug([...tablesSlug, res?.table_slug]);
      });
  };

  const getOptionLabel = (option) => {
    return getRelationFieldLabel(field, option);
  };

  const onCompanyChange = (e) => {
    e.stopPropagation();
    setValue([]);
    handleClose();
  };

  //==========MENU CLOSE FUNCTION=========
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentLevel(1);
    setDataFilter([]);
    setTablesSlug([]);
  };

  const clearButton = () => {
    setValue("");
    setInputValue({});
  };

  useEffect(() => {
    const val = computedData[computedData.length - 1];
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
  }, [computedData]);

  return (
    <div className={styles.cascading}>
      <div className={styles.input_layer}>
        {field?.type === "LOOKUPS" ? (
          <Autocomplete
            multiple
            id="tags-standard"
            value={computedValue}
            getOptionLabel={(option) => option.label}
            onChange={onCompanyChange}
            renderInput={(params) => (
              <TextField {...params} variant="standard" onClick={handleClick} />
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
                      </div>
                    ))}
                  </div>
                </>
              );
            }}
          />
        ) : (
          <TextField
            required
            fullWidth
            id="password"
            onClick={handleClick}
            value={insideValue ?? ""}
            inputStyle={{ height: "35px" }}
            InputProps={{
              endAdornment: value && (
                <InputAdornment position="end">
                  <IconGenerator
                    icon="arrow-up-right-from-square.svg"
                    style={{
                      marginLeft: "0",
                      cursor: "pointer",
                      marginRight: "40px",
                      color: "#404000",
                    }}
                    size={15}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      navigateToForm(tableSlug, "EDIT", value[0]);
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                height: "37px",
              },
            }}
          />
        )}
        {value && (
          <button className={styles.cancel_icon} onClick={() => clearButton()}>
            <CloseIcon />
          </button>
        )}
      </div>
      <Drawer
        open={open}
        anchor="right"
        classes={{ paperAnchorRight: styles.verticalDrawer }}
        onClose={handleClose}
      >
        <CascadingItem
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          fields={field}
          field={values}
          handleClose={handleClose}
          setValue={setValue}
          setTitle={setTitle}
          title={title}
          setSecondTitle={setSecondTitle}
          secondTitle={secondTitle}
          setInputValue={setInputValue}
          tableSlug={tableSlug}
          setFormValue={setFormValue}
          index={index}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
          tablesSlug={tablesSlug}
          setTablesSlug={setTablesSlug}
          name={name}
          control={control}
        />
      </Drawer>
    </div>
  );
}

export default CascadingElement;
