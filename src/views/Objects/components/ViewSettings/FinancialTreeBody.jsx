import React, { useEffect, useMemo, useState } from "react";
import { CTableCell, CTableRow } from "../../../../components/CTable";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import style from "./style.module.scss";
import { useParams } from "react-router-dom";
import FinancialTableRow from "@/views/Objects/components/ViewSettings/TableRow";
import { useFieldArray, useWatch } from "react-hook-form";
import { generateID } from "@/utils/generateID";

const FinancialTreeBody = ({
  form,
  item,
  objectList = [],
  level = 1,
  setObjectList,
  viewId,
  indexMap,
  indexParent,
  key,
  groupby,
  relations,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { tableSlug } = useParams();
  const children = useMemo(() => {
    return objectList.filter((el) => el[`${tableSlug}_id`] === item.guid);
  }, [objectList, tableSlug, item]);

  const {
    fields: chartChild,
    append,
    replace,
    remove,
  } = useFieldArray({
    control: form.control,
    name: `chartOfAccounts.${indexParent}.${item.guid}`,
    keyName: "key",
  });

  useEffect(() => {
    if (chartChild.length === 0) {
      replace([
        {
          table_slug: "",
          type: "",
          number_field: "",
          date_field: "",
          id: generateID(),
        },
      ]);
    }
  }, []);

  const fields = useWatch({
    control: form.control,
    name: `chartOfAccounts.${indexParent}.${item.guid}`,
  });

  if (!children.length) {
    return (
      <>
        {chartChild?.map((fieldItem, indexField) => (
          <FinancialTableRow
            item={item}
            optionIndex={indexField}
            form={form}
            append={append}
            remove={remove}
            chartChild={chartChild}
            viewId={viewId}
            objectList={objectList}
            key={indexField.id}
            level={level + 1}
            indexParent={indexParent}
            indexMap={indexMap}
            relations={relations}
            setObjectList={setObjectList}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <CTableRow key={item.guid}>
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
              {item.name}
            </div>
          </div>
        </CTableCell>
        <CTableCell />
        <CTableCell />
        <CTableCell />
        <CTableCell />
        <CTableCell />
      </CTableRow>
      {expanded &&
        children.map((item, index) => (
          <FinancialTreeBody
            item={item}
            form={form}
            viewId={viewId}
            objectList={objectList}
            key={item.guid}
            level={level + 1}
            indexParent={indexParent}
            indexMap={index}
            setObjectList={setObjectList}
            groupby={groupby}
            relations={relations}
          />
        ))}
    </>
  );
};

export default FinancialTreeBody;
