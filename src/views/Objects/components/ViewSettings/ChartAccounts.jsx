import { Checkbox } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import style from "./style.module.scss";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../components/CTable";
import constructorObjectService from "../../../../services/constructorObjectService";
import { useParams } from "react-router-dom";
import FinancialTreeBody from "./FinancialTreeBody";
import HFSelect from "../../../../components/FormElements/HFSelect";
import constructorFieldService from "../../../../services/constructorFieldService";
import TableRowButton from "@/components/TableRowButton";
import TableCancelButton from "@/components/TableRowButton/CancelButton";
import RemoveIcon from "@mui/icons-material/Remove";
import constructorRelationService from "@/services/constructorRelationService";
import PageFallback from "@/components/PageFallback";

const ChartAccounts = ({
  viewId,
  form,
  addChart,
  charts,
  index,
  removeChart,
}) => {
  const { tableSlug, appId } = useParams();
  const [objectList, setObjectList] = useState([]);
  const [groupByField, setGroupByField] = useState([]);
  const [relations, setRelations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const groupby = useWatch({
    control: form.control,
    name: `chartOfAccounts.${index}.group_by`,
  });

  useEffect(() => {
    constructorFieldService
      .getList({
        table_slug: tableSlug,
      })
      .then((res) => {
        setGroupByField(res.fields.find((item) => item.type === "MULTISELECT"));
      })
      .catch((a) => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    constructorObjectService
      .getList(tableSlug, {
        data: {
          app_id: appId,
          [groupByField?.slug]: groupby ?? [],
        },
      })
      .then((res) => {
        setObjectList(res.data.response);
        setIsLoading(false);
      })
      .catch((a) => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [groupByField, groupby]);

  const parentElements = useMemo(() => {
    return objectList.filter((row) => !row[`${tableSlug}_id`]);
  }, [objectList, tableSlug]);

  useEffect(() => {
    form.setValue(`group_by_field_selected`, groupByField);
  }, [groupByField]);

  useEffect(() => {
    constructorRelationService
      .getList({
        table_slug: tableSlug,
      })
      .then((res) => {
        setRelations(res.relations);
      })
      .catch((a) => {});
  }, [groupby]);

  return isLoading ? (
    <PageFallback />
  ) : (
    <>
      <CTable
        count={""}
        page={""}
        setCurrentPage={""}
        columnsCount={4}
        loader={false}
        removableHeight={false}
        disablePagination={true}
      >
        <CTableHead>
          <CTableHeadRow>
            <CTableCell>
              <div className={style.groupbyAndDelete}>
                {groupByField?.attributes?.options?.[0]?.label &&
                groupByField?.attributes?.options?.[0]?.value ? (
                  <HFSelect
                    fullWidth
                    required
                    control={form.control}
                    options={groupByField.attributes.options}
                    name={`chartOfAccounts.${index}.group_by`}
                  />
                ) : (
                  ""
                )}

                <button onClick={() => removeChart(index)}>
                  <RemoveIcon style={{ color: "#FF4842" }} />
                </button>
              </div>
            </CTableCell>
            <CTableCell>Тип</CTableCell>
            <CTableCell>Таблица</CTableCell>
            <CTableCell>Цифровое поля </CTableCell>
            <CTableCell>Поля даты</CTableCell>
            <CTableCell>Фильтр</CTableCell>
          </CTableHeadRow>
        </CTableHead>

        <CTableBody loader={false} columnsCount={3} dataLength={3}>
          {parentElements.map((item, indexMap) => (
            <FinancialTreeBody
              indexMap={indexMap}
              indexParent={index}
              form={form}
              viewId={viewId}
              key={item.guid}
              item={item}
              objectList={objectList}
              setObjectList={setObjectList}
              groupby={groupby}
              relations={relations}
            />
          ))}
        </CTableBody>
      </CTable>
    </>
  );
};

export default ChartAccounts;
