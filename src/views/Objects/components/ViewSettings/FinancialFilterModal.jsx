import { Add, Close } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import constructorObjectService from "../../../../services/constructorObjectService";
import styles from "./style.module.scss";
import ViewForm from "./ViewForm";
import ViewsList from "./ViewsList";
import { CTableCell } from "@/components/CTable";
import style from "@/views/Objects/components/ViewSettings/style.module.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Popover from "@mui/material/Popover";
import HFSelect from "@/components/FormElements/HFSelect";
import HFMultipleSelect from "@/components/FormElements/HFMultipleSelect";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { generateID } from "@/utils/generateID";
import constructorFieldService from "@/services/constructorFieldService";
import { Filter } from "@/views/Objects/components/FilterGenerator";
import { listToMap } from "@/utils/listToMap";
import useFilters from "@/hooks/useFilters";
import { filterActions } from "@/store/filter/filter.slice";
import ClearIcon from "@mui/icons-material/Clear";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

const FinancialFilterModal = ({
  form,
  indexParent,
  item,
  children,
  viewId,
  optionIndex,
  filterFieldArea,
}) => {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [responseForGrouping, setResponseForGrouping] = useState([]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { tableSlug, appId } = useParams();

  const {
    fields: filtersCharts,
    append: appendFilter,
    replace: replaceFilter,
    remove: removeFilter,
  } = useFieldArray({
    control: form.control,
    name: `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filterFields`,
    keyName: "key",
  });
  const filterForm = form.watch(
    `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filters`
  );

  useEffect(() => {
    if (filtersCharts.length === 0) {
      replaceFilter([{ field_id: "", id: generateID() }]);
    }
  }, []);

  const selectedTableOptions = useWatch({
    control: form.control,
    name: `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.table_slug`,
  });

  useEffect(() => {
    if (selectedTableOptions) {
      constructorObjectService
        .getList(selectedTableOptions, {
          data: {
            with_relations: true,
            offset: 0,
            limit: 10,
          },
        })
        .then((res) => {
          setLeft(
            res.data.fields
              .map((item) => ({
                label: item.label,
                value: item.id,
              }))
              .concat(
                res.data.relation_fields.map((item) => ({
                  label: `${item.label} (${item.table_label})`,
                  value: item.id,
                  group: item.table_label,
                }))
              )
          );
          setResponseForGrouping(res.data);
        })
        .catch((a) => {});
    }
  }, [selectedTableOptions]);

  const {
    data: { views, fieldsMap } = {
      views: [],
      fieldsMap: {},
    },
    isLoading,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", selectedTableOptions],
    () => {
      return constructorObjectService.getList(selectedTableOptions, {
        data: { limit: 10, offset: 0, with_relations: true },
      });
    },
    {
      enabled: !!selectedTableOptions,
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          fieldsMap: listToMap(data?.fields.concat(data?.relation_fields)),
        };
      },
      onSuccess: ({ views }) => {},
    }
  );

  const onChange = (value, name) => {
    form.setValue(
      `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filters.${name}`,
      value === "true" ? [true] : value === "false" ? [false] : value
    );
  };

  const computedLeftOptions = useMemo(() => {
    const groups = responseForGrouping?.relation_fields
      ?.map((item) => item.table_label)
      .filter(function (item, pos) {
        return (
          responseForGrouping?.relation_fields
            ?.map((item) => item.table_label)
            .indexOf(item) == pos
        );
      });

    const compute =
      groups?.map((item) => {
        return {
          label: item,
          options: responseForGrouping.relation_fields
            .filter((option) => option.table_label === item)
            .map((option) => ({
              label: option.label,
              value: option.id,
            })),
        };
      }) ?? [];

    const old = [
      {
        label: "Fields",
        options: responseForGrouping?.fields?.map((item) => ({
          label: item.label,
          value: item.id,
        })),
      },
    ];

    return [...old, ...compute];
  });

  return (
    <>
      <CTableCell>
        {!children?.length ? (
          <div className={style.filter}>
            <button
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
            >
              <FilterAltIcon />
            </button>
            {filterForm ? (
              Object.keys(filterForm)?.[0] === "" ||
              Object.keys(filterForm)?.[0] === undefined ? (
                ""
              ) : (
                <span>{Object.keys(filterForm)?.length}</span>
              )
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </CTableCell>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={style.cardFilter}>
          {/*<div className={styles.header}>*/}
          {/*  <div className={styles.cardTitle}>Фильтр</div>*/}
          {/*  <IconButton className={styles.closeButton} onClick={handleClose}>*/}
          {/*    <Close className={styles.closeIcon}/>*/}
          {/*  </IconButton>*/}
          {/*</div>*/}

          <div className={style.body}>
            {filtersCharts.map((filterItem, filterIndex) => (
              <div key={filterItem.id} className={style.wrapper}>
                <HFSelect
                  control={form.control}
                  options={computedLeftOptions}
                  optionType={"GROUP"}
                  name={`chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filterFields.${filterIndex}.field_id`}
                />

                {/*<Controller
                    control={form.control}
                    name={`chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filterFields.${filterIndex}.field_id`}
                    render={({
                               field: {onChange: onFormChange, value},
                               fieldState: {error},
                             }) => (
                      <FormControl sx={{m: 1, minWidth: 120}}>
                        <
                          Select
                          native


                        >

                          {
                            computedLeftOptions(responseForGrouping)?.map((item, index) => (
                              <optgroup label={item} key={item}>
                                {
                                  left.map((option, index) => (
                                    option.group && option.group === item ?
                                      <option value={option.value} key={option.value}>{option.label}</option> : ''
                                  ))
                                }
                              </optgroup>
                            ))
                          }

                          <optgroup label={'Fields'}>
                            {
                              left.map((option, index) => (
                                !option.group ? <option value={option.value} key={option.value}>{option.label}</option> : ''
                              ))
                            }
                          </optgroup>

                        </Select>
                      </FormControl>
                    )}
                  ></Controller>*/}

                <Filter
                  field={
                    form.watch(
                      `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filterFields.${filterIndex}.field_id`
                    )
                      ? fieldsMap[
                          form.watch(
                            `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filterFields.${filterIndex}.field_id`
                          )
                        ]
                      : ""
                  }
                  name={`${form.watch(
                    `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filterFields.${filterIndex}.field_id`
                  )}`}
                  onChange={onChange}
                  filters={form.watch(
                    `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.filters`
                  )}
                  tableSlug={tableSlug}
                />

                <RectangleIconButton onClick={() => removeFilter(filterIndex)}>
                  <ClearIcon />
                </RectangleIconButton>
              </div>
            ))}

            <div className={style.footerButton}>
              <div
                className={styles.button}
                onClick={() => appendFilter({ field_id: "", id: generateID() })}
              >
                <Add color="primary" />
                <p>Добавить</p>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default FinancialFilterModal;
