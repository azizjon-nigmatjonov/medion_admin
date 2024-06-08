import React, { useMemo, useState } from "react";
import styles from "./style.module.scss";
import {
  Autocomplete,
  Drawer,
  InputAdornment,
  Menu,
  TextField,
} from "@mui/material";
import CascadingSectionItem from "./CascadingSectionItem";
import constructorObjectService from "../../../services/constructorObjectService";
import IconGenerator from "../../IconPicker/IconGenerator";
import useTabRouter from "../../../hooks/useTabRouter";
import CloseIcon from "@mui/icons-material/Close";
import { getRelationFieldLabel } from "../../../utils/getRelationFieldLabel";
import { useQuery } from "react-query";

function CascadingSection({
  setValue,
  field,
  name,
  setFormValue,
  tableSlug,
  value,
  control,
}) {
  const [values, setValues] = useState();
  const [title, setTitle] = useState([]);
  const [secondTitle, setSecondTitle] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const [tablesSlug, setTablesSlug] = useState([]);
  const { navigateToForm } = useTabRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { data: options } = useQuery(
    [
      "GET_OBJECT_LIST",
      tableSlug,
      typeof value?.[0] === "string" ? value : null,
    ],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          view_fields:
            field?.view_fields?.map((field) => field.slug) ??
            field?.attributes?.view_fields?.map((field) => field.slug),
          additional_request: {
            additional_field: "guid",
            additional_values: value,
          },
          additional_ids: value,
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

  //==========COMPUTED VALUE FOR MANY2MANY==========
  const computedValue = useMemo(() => {
    if (!value) return [];

    return value
      ?.map((id) => {
        const option = options?.find((el) => el?.guid === id);

        if (!option) return null;
        return {
          ...option,
          label: getRelationFieldLabel(field, option),
        };
      })
      ?.filter((el) => el);
  }, [options, value, field]);

  //==========COMPUTED VALUE FOR MANY2ONE==========
  const insideValue = useMemo(() => {
    let values = "";
    if (!value || value?.length === 0) return "";
    if (value?.length) {
      const slugs = field?.attributes?.view_fields?.map((i) => i.slug);
      slugs?.forEach((item) => (values += " " + value?.[0]?.[item]));
    }
    return values;
  }, [value, field]);

  //============SETVALUE FUNCTION=========
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

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentLevel(1);
    setDataFilter([]);
    setTablesSlug([]);
  };

  const clearButton = () => {
    setValue("");
  };

  return (
    <div className={styles.cascading}>
      <div className={styles.input_layer}>
        {field?.relation_type === "Many2Many" || name === "multiple_values" ? (
          <Autocomplete
            multiple
            id="tags-standard"
            options={computedValue}
            value={computedValue}
            getOptionLabel={(option) => option.title}
            onChange={onCompanyChange}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                onClick={handleClick}
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
            value={insideValue}
            inputStyle={{ height: "35px" }}
            InputProps={{
              endAdornment: insideValue && (
                <InputAdornment position="end">
                  {name !== "multiple_values" && (
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
                  )}
                </InputAdornment>
              ),
              sx: {
                height: "37px",
              },
            }}
          />
        )}
        {insideValue && (
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
        <CascadingSectionItem
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          fields={field}
          field={values}
          handleClose={handleClose}
          setValue={setValue}
          setTitle={setTitle}
          title={title}
          value={value}
          setSecondTitle={setSecondTitle}
          secondTitle={secondTitle}
          tableSlug={tableSlug}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
          setTablesSlug={setTablesSlug}
          tablesSlug={tablesSlug}
          name={name}
          control={control}
        />
      </Drawer>
    </div>
  );
}

export default CascadingSection;
