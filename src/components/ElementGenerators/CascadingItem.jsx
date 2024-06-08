import React, { useState, useEffect, useMemo } from "react";
import constructorObjectService from "../../services/constructorObjectService";
import { get } from "@ngard/tiny-get";
import CascadingMany2Many from "./CascadingSection/CascadingMany2Many";
import CascadingMany2One from "./CascadingMany2One";
import { useQuery } from "react-query";
import { useWatch } from "react-hook-form";

function CascadingItem({
  fields,
  field,
  level = 1,
  handleClose,
  currentLevel,
  setCurrentLevel,
  setValue,
  title,
  setTitle,
  setInputValue,
  tableSlug,
  setFormValue,
  index,
  dataFilter,
  setDataFilter,
  tablesSlug,
  setTablesSlug,
  control,
}) {
  const [value, setValues] = useState();
  const [searchText, setSearchText] = useState("");
  const [levelSlug, setLevelSlug] = useState("");
  const [levelTableSlug, setLevelTableSlug] = useState("");
  const [ids, setIds] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState("");

  //===========SEARCH FILTER==========
  const foundServices = useMemo(() => {
    if (!searchText) return [];
    return field.filter(
      (item) =>
        item?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        item?.email?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }, [searchText, field]);

  //===========AUTO FILTERS============
  const autoFilters = fields?.attributes?.auto_filters;
  const autoFiltersFieldFroms = useMemo(() => {
    return autoFilters?.map((el) => `multi.${index}.${el.field_from}`) ?? [];
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

  //===========DATA FOR SERVICE FILTER==========
  const dataObject = useMemo(() => {
    const values = {};
    tablesSlug?.forEach((item, index) => {
      values[`${item}_id`] = dataFilter[index];
      values[`${item}_ids`] = dataFilter[index];
    });
    return { ...values, ...autoFiltersValue };
  }, [tablesSlug, dataFilter, autoFiltersValue]);

  //===========SEARCH REQUEST============
  const { data: searchServices } = useQuery(
    ["GET_OBJECT_LIST", debouncedValue],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          view_fields: fields.attributes?.view_fields?.map((f) => f.slug),
          search: debouncedValue.trim(),
          limit: 10,
          input: true,
          ...autoFiltersValue,
        },
      });
    },
    {
      select: (res) => {
        return res?.data?.response ?? [];
      },
    }
  );

  //=============MAIN SETVALUE FUNCTION==========
  const handleClick = (item) => {
    const cascadingLength = fields?.attributes?.cascadings?.length;

    if (
      cascadingLength &&
      currentLevel === cascadingLength &&
      fields?.type === "LOOKUP"
    ) {
      setValue(item?.guid);
      setInputValue(item);

      fields?.attributes?.autofill?.forEach(({ field_from, field_to }) => {
        setFormValue(`multi.${index}.${field_to}`, get(item, field_from));
      });

      handleClose();
    } else if (cascadingLength && level < cascadingLength) {
      setDataFilter([...new Set(dataFilter), item?.guid]);
      setTitle([...title, item?.name]);

      const cascading = fields?.attributes?.cascadings;

      const data =
        currentLevel === 3
          ? dataObject
          : {
              [levelSlug]: item?.guid,
            };
      constructorObjectService
        .getList(cascading[cascadingLength - 1 - level]?.table_slug, {
          data: {
            ...data,
            input: true,
          },
        })
        .then((res) => {
          setValues(res?.data?.response);
          setTablesSlug([...tablesSlug, res?.table_slug]);
          setCurrentLevel(level + 1);
        })
        .catch((err) => {});
    }
  };

  //===========BACK ARROW FUNCTION===========
  const backArrowButton = () => {
    setCurrentLevel(currentLevel - 1);
    setTablesSlug(tablesSlug.splice(0, tablesSlug.length - 1));
    setDataFilter(dataFilter.splice(0, dataFilter.length - 1));
    setTitle(title.splice(0, title?.length - 1));
  };

  //=========MANY2MANT CONFIRM FUNCTION===========
  const confirmButton = () => {
    setValue(ids);
    handleClose();
  };

  //==========CHECKBOX FUNCTION MANY2MANY===========
  const onChecked = (id) => {
    setIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((items) => items !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  //==========MANY2ONE SETVALUE FUNCTION===========
  const handleServices = (item) => {
    setValue(item.guid);
    setInputValue(item);
    handleClose();

    fields?.attributes?.autofill.forEach(({ field_from, field_to }) => {
      setFormValue(`multi.${index}.${field_to}`, get(item, field_from));
    });
  };

  useEffect(() => {
    if (fields?.attributes?.cascadings?.length) {
      const cascadingIndex = fields.attributes.cascadings.length - currentLevel;
      setLevelSlug(fields.attributes.cascadings[cascadingIndex].field_slug);

      if (cascadingIndex > 0) {
        setLevelTableSlug(
          fields.attributes.cascadings[cascadingIndex - 1].table_slug
        );
      }
    }
  }, [fields, currentLevel]);

  return (
    <>
      {fields?.type === "LOOKUPS"
        ? currentLevel === level && (
            <CascadingMany2Many
              backArrowButton={backArrowButton}
              level={level}
              fields={fields}
              title={title}
              searchText={searchText}
              currentLevel={currentLevel}
              handleClick={handleClick}
              foundServices={foundServices}
              setSearchText={setSearchText}
              field={field}
              confirmButton={confirmButton}
              onChecked={onChecked}
              setDebouncedValue={setDebouncedValue}
              searchServices={searchServices}
              debouncedValue={debouncedValue}
              handleServices={handleServices}
            />
          )
        : currentLevel === level && (
            <CascadingMany2One
              backArrowButton={backArrowButton}
              level={level}
              title={title}
              searchText={searchText}
              setSearchText={searchText}
              field={field}
              fields={fields}
              foundServices={foundServices}
              currentLevel={currentLevel}
              handleClick={handleClick}
              // setState={setState}
              setDebouncedValue={setDebouncedValue}
              searchServices={searchServices}
              debouncedValue={debouncedValue}
              handleServices={handleServices}
            />
          )}
      {level < 4 && value && (
        <CascadingItem
          fields={fields}
          field={value}
          level={level + 1}
          handleClose={handleClose}
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          setValue={setValue}
          searchText={searchText}
          foundServices={foundServices}
          title={title}
          setTitle={setTitle}
          setInputValue={setInputValue}
          tableSlug={tableSlug}
          setFormValue={setFormValue}
          index={index}
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
          tablesSlug={tablesSlug}
          setTablesSlug={setTablesSlug}
          control={control}
        />
      )}
    </>
  );
}

export default CascadingItem;
