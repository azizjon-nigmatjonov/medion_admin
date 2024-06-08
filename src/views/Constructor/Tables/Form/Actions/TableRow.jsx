import { Delete } from "@mui/icons-material";
import { Autocomplete, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import useDebounce from "../../../../../hooks/useDebounce";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorRelationService from "../../../../../services/constructorRelationService";
import styles from "./style.module.scss";

function TableRow({
  summary,
  control,
  typeList,
  index,
  remove,
  update,
  slug,
  relation,
  setValue,
}) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const selectedTableOptions = useWatch({
    control: control,
    name: `attributes.additional_parameters.${index}.table_slug`,
  });
  const selectedValueOptions = useWatch({
    control: control,
    name: `attributes.additional_parameters.${index}.value`,
  });

  //============GET RELATIONS===========
  const { data: relations } = useQuery(
    ["GET_RELATION_LIST", slug],
    () => {
      return constructorRelationService.getList({
        table_slug: slug,
        relation_table_slug: slug,
      });
    },
    {
      select: (res) => {
        return res?.relations;
      },
    }
  );

  //============COMPUTED OPTIONS===============
  const getListValues = useMemo(() => {
    const relationsWithRelatedTableSlug = relations?.map((relation) => ({
      ...relation,
      relatedTableSlug:
        relation.table_to?.slug === slug ? "table_from" : "table_to",
    }));

    return relationsWithRelatedTableSlug
      ?.filter((relation) => {
        return !(
          (relation.type === "Many2One" &&
            relation.table_from?.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === slug)
        );
      })
      .map((relation) => ({
        label: relation.table_from.label,
        value: relation.table_from.slug,
        view:
          relation?.table_from.subtitle_field_slug ||
          relation?.table_to?.subtitle_field_slug,
      }));
  }, [relations, slug]);

  //========COMPUTE FILTERED DATA=======
  const getFilterData = useMemo(() => {
    return getListValues?.find((item) => {
      if (item?.value === selectedTableOptions) {
        return item;
      }
    });
  }, [getListValues, selectedTableOptions]);

  const { data: values } = useQuery(
    ["GET_OBJECT_LIST", selectedTableOptions, getFilterData, debouncedValue],
    () => {
      return constructorObjectService.getList(selectedTableOptions, {
        data: {
          limit: 10,
          offset: 0,
          view_fields: [getFilterData?.view],
          search: debouncedValue,
        },
      });
    },
    {
      enabled: !!selectedTableOptions,
      select: (res) => {
        return res?.data?.response;
      },
    }
  );

  //==========OBJECTID OPTIONS==========
  const valueList = useMemo(() => {
    return values?.map((item) => ({
      label: item?.[getFilterData?.view],
      value: item?.guid,
    }));
  }, [values, getFilterData]);

  //==============FUNCTIONS============

  const onUpdate = () => {
    update([...relation]);
  };

  const deleteSummary = (index) => {
    remove(index);
  };

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  return (
    <div key={summary.key} className={styles.tableActions}>
      <div className={styles.tableType}>
        <h4>Type:</h4>
        <div className={styles.tableType_select}>
          <HFSelect
            fullWidth
            control={control}
            options={typeList}
            name={`attributes.additional_parameters.${index}.type`}
            onChange={onUpdate}
          />
        </div>
      </div>
      {summary?.type !== "TABLE" && summary?.type !== "HARDCODE" && (
        <div className={styles.tableType}>
          <h4>Table:</h4>
          <div className={styles.tableType_select}>
            <HFSelect
              fullWidth
              control={control}
              options={getListValues}
              name={`attributes.additional_parameters.${index}.table_slug`}
            />
          </div>
        </div>
      )}
      <div className={styles.tableType}>
        <h4>Name:</h4>
        <div className={styles.tableType_select}>
          <HFTextField
            fullWidth
            control={control}
            options={typeList}
            name={`attributes.additional_parameters.${index}.name`}
          />
        </div>
      </div>
      <div className={styles.tableType}>
        <h4>Value:</h4>
        <div className={styles.tableType_select}>
          {summary?.type === "OBJECTID" ? (
            <Autocomplete
              id='attributes'
              multiple
              options={valueList ?? []}
              value={
                Array.isArray(selectedValueOptions) ? selectedValueOptions : []
              }
              freeSolo
              onChange={(e, values) => {
                setValue(
                  `attributes.additional_parameters.${index}.value`,
                  values
                );
              }}
              getOptionLabel={(option) => option.label}
              inputValue={inputValue}
              disablePortal
              blurOnSelect
              openOnFocus
              onInputChange={(_, val) => {
                setInputValue(val);
                inputChangeHandler(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
            ></Autocomplete>
          ) : summary?.type === "TABLE" ? (
            <HFSelect
              fullWidth
              control={control}
              options={getListValues}
              name={`attributes.additional_parameters.${index}.value`}
            />
          ) : (
            <HFTextField
              fullWidth
              control={control}
              options={typeList}
              name={`attributes.additional_parameters.${index}.value`}
            />
          )}
        </div>
      </div>

      <div className={styles.deleteBtn}>
        <RectangleIconButton color='error' onClick={() => deleteSummary(index)}>
          <Delete color='error' />
        </RectangleIconButton>
      </div>
    </div>
  );
}

export default TableRow;
