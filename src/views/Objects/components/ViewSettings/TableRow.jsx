import React, { useEffect, useMemo, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
  CTableHead,
  CTableHeadCell,
  CTableHeadRow,
} from "../../../../components/CTable";
import FRow from "../../../../components/FormElements/FRow";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import HFSelect from "../../../../components/FormElements/HFSelect";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import style from "./style.module.scss";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import clientRelationService from "../../../../services/auth/clientRelationService";
import constructorRelationService from "../../../../services/constructorRelationService";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import constructorFieldService from "../../../../services/constructorFieldService";
import RemoveIcon from "@mui/icons-material/Remove";
import { generateID } from "../../../../utils/generateID";
import { IconButton, Modal } from "@mui/material";
import FinancialTreeBody from "@/views/Objects/components/ViewSettings/FinancialTreeBody";
import FinancialFilterModal from "@/views/Objects/components/ViewSettings/FinancialFilterModal";
import ViewSettings from "@/views/Objects/components/ViewSettings/index";
import Popover from "@mui/material/Popover";
import styles from "@/views/Objects/components/ViewSettings/style.module.scss";
import { Add, Close } from "@mui/icons-material";
import HFMultipleSelect from "@/components/FormElements/HFMultipleSelect";

const FinancialTableRow = ({
  form,
  item,
  objectList = [],
  level = 1,
  setObjectList,
  viewId,
  optionIndex,
  indexMap,
  indexParent,
  append,
  remove,
  chartChild,
  relations,
}) => {
  const groupby = useWatch({
    control: form.control,
    name: `chartOfAccounts.form_fields.selected_fields.${indexParent}`,
  });

  const [expanded, setExpanded] = useState(false);
  const [digitalAreas, setDigitalAreas] = useState([]);
  const [dateAreas, setDateAreas] = useState([]);
  const { tableSlug } = useParams();
  const [filterFieldArea, setFilterFieldArea] = useState([]);

  const optionsType = [
    {
      label: "Кредет",
      value: "credit",
    },
    {
      label: "Дебет",
      value: "debet",
    },
  ];

  const children = useMemo(() => {
    return objectList.filter((el) => el[`${tableSlug}_id`] === item.guid);
  }, [objectList, tableSlug, item]);

  const tableOptions = useMemo(() => {
    const relationsWithRelatedTableSlug = relations?.map((relation) => ({
      ...relation,
      relatedTableSlug:
        relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
    }));

    return relationsWithRelatedTableSlug
      ?.filter((relation) => {
        return !(
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
        );
      })
      .map((relation) => ({
        label: relation.table_from.label,
        value: `${relation.table_from.slug}#${relation.id}`,
        id: relation.id,
      }));
  }, [relations, tableSlug]);

  const selectedTableOptions = useWatch({
    control: form.control,
    name: `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.table_slug`,
  });

  useEffect(() => {
    form.setValue(
      `chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.relation_id`,
      tableOptions.filter((item) => item.value === selectedTableOptions)?.[0]
        ?.id
    );
  }, [selectedTableOptions]);

  useEffect(() => {
    selectedTableOptions &&
      constructorFieldService
        .getList({
          table_slug: selectedTableOptions?.split("#")?.[0],
        })
        .then((res) => {
          setDigitalAreas(
            res.fields
              .filter(
                (item) =>
                  item.type === "NUMBER" ||
                  item.type === "FORMULA" ||
                  item.type === "FORMULA_FRONTEND"
              )
              .map((item) => ({
                label: item.label,
                value: item.slug,
              }))
          );
          setDateAreas(
            res.fields
              .filter(
                (item) => item.type === "DATE" || item.type === "DATE_TIME"
              )
              .map((item) => ({
                label: item.label,
                value: item.slug,
              }))
          );
          setFilterFieldArea(
            res.fields.map((item) => ({
              label: item.label,
              value: item.slug,
            }))
          );
        })
        .catch((a) => {});
  }, [selectedTableOptions]);

  const removeChild = (index) => {
    remove(index);
  };

  return (
    <>
      <CTableRow>
        <CTableCell>
          <div className={style.wrapper}>
            <div className={style.title}>
              {<div style={{ marginRight: `${10 * level}px` }} />}
              {children?.length ? (
                <button onClick={() => setExpanded(!expanded)}>
                  <KeyboardArrowDownRoundedIcon />
                </button>
              ) : (
                ""
              )}
              {optionIndex !== 0 ? "" : item.name}
            </div>

            {optionIndex === 0 ? (
              <button
                className={style.addIcon}
                onClick={() =>
                  append({
                    id: generateID(),
                    table_slug: "",
                    type: "",
                    number_field: "",
                    date_field: "",
                  })
                }
              >
                <AddIcon />
              </button>
            ) : (
              ""
            )}

            {optionIndex !== 0 ? (
              <button
                className={style.addIcon}
                onClick={() => removeChild(optionIndex)}
              >
                <RemoveIcon style={{ color: "#B72136" }} />
              </button>
            ) : (
              ""
            )}
          </div>
        </CTableCell>
        <CTableCell>
          {!children?.length ? (
            <HFSelect
              fullWidth
              control={form.control}
              options={optionsType}
              name={`chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.type`}
            />
          ) : (
            ""
          )}
        </CTableCell>
        <CTableCell>
          {!children?.length ? (
            <HFSelect
              fullWidth
              control={form.control}
              options={tableOptions}
              name={`chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.table_slug`}
            />
          ) : (
            ""
          )}
        </CTableCell>
        <CTableCell>
          {!children?.length ? (
            <HFSelect
              fullWidth
              control={form.control}
              options={digitalAreas}
              name={`chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.number_field`}
            />
          ) : (
            ""
          )}
        </CTableCell>
        <CTableCell>
          {!children?.length ? (
            <HFSelect
              fullWidth
              control={form.control}
              options={dateAreas}
              name={`chartOfAccounts.${indexParent}.${item.guid}.${optionIndex}.date_field`}
            />
          ) : (
            ""
          )}
        </CTableCell>

        <FinancialFilterModal
          form={form}
          viewId={viewId}
          indexParent={indexParent}
          item={item}
          children={children}
          optionIndex={optionIndex}
          filterFieldArea={filterFieldArea}
        />
      </CTableRow>
    </>
  );
};

export default FinancialTableRow;
