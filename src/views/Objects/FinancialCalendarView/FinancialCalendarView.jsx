import { useState } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import constructorObjectService from "../../../services/constructorObjectService";
import styles from "./style.module.scss";
import { useEffect } from "react";
import { format } from "date-fns";
import RecursiveBlock from "./RecursiveBlock";
import { ru } from "date-fns/locale";
import { numberWithSpaces } from "../../../utils/formatNumbers";
import TotalAmountByMonth from "./TotalAmountByMonth";
import PageFallback from "../../../components/PageFallback";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";

const FinancialCalendarView = ({
  view,
  fieldsMap,
  tab,
  filters,
  isLoading,
  financeDate,
  financeTotal,
  totalBalance,
}) => {
  const { tableSlug } = useParams();
  const [dataList, setDataList] = useState();

  const parentElements = useMemo(() => {
    if (financeDate?.length) {
      return financeDate?.filter((row) => !row[`${tableSlug}_id`]);
    }
  }, [financeDate, tableSlug]);

  const getDates = useMemo(() => {
    const val = [];
    if (financeDate?.length > 0) {
      financeDate?.[0]?.amounts?.forEach((item) => {
        val.push(item?.month);
      });
    }
    return val;
  }, [financeDate]);

  const getTotal = useMemo(() => {
    const val = [];
    if (financeTotal?.length > 0) {
      financeTotal?.forEach((item) => {
        val.push(item?.amount);
      });
    }
    return val;
  }, [financeTotal]);

  const getAccountList = () => {
    constructorObjectService
      .getList(tableSlug, {
        data: { offset: 0, ...filters, [tab?.slug]: tab?.value },
      })
      .then((res) => {
        setDataList(res?.data?.response);
      });
  };

  useEffect(() => {
    getAccountList();
  }, []);

  return (
    <div className={styles.financial_view}>
      <div className={styles.datesRow}>
        <div className={styles.mockBlock} />
        {getDates?.map((item) => (
          <div className={styles.monthBlock}>
            <span className={styles.monthText}>
              {`${format(new Date(item), "LLL", { locale: ru })} '${format(
                new Date(item),
                "yy",
                { locale: ru }
              )}`}
            </span>
          </div>
        ))}
      </div>
      {Object.keys(totalBalance ?? {}).length > 0 && (
        <div>
          <TotalAmountByMonth totalBalance={totalBalance} />
        </div>
      )}
      <div className={styles.recursiveBlock}>
        <div className={styles.priceBlockChild} />
      </div>
      <div className={styles.datesRow}>
        <div className={styles.mockBlock} />

        {getTotal?.map((item) => (
          <div className={styles.totalBlock}>
            {/* <div className={styles.priceBlockChild}/> */}
            <div className={styles.joinedPriceBlockChild}>
              <span className={styles.totalText}>{numberWithSpaces(item)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.row_element}>
        {parentElements?.map((row) => (
          <RecursiveBlock
            key={row?.guid}
            row={row}
            view={view}
            dataList={dataList}
            fieldsMap={fieldsMap}
            financeDate={financeDate}
            getDates={getDates}
          />
        ))}
      </div>
    </div>
  );
};

export default FinancialCalendarView;
