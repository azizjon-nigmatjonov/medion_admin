import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import PageFallback from "../../../components/PageFallback";
import constructorObjectService from "../../../services/constructorObjectService";
import FastFilter from "../components/FastFilter";
import RecursiveBlock from "./RecursiveBlock";
import styles from "./style.module.scss";
import {pageToOffset} from "@/utils/pageToOffset";

const TreeView = ({ groupField, fieldsMap, group, view, tab, filters }) => {
  const { tableSlug } = useParams();
  const { new_list } = useSelector((state) => state.filter);

  const [tableLoader, setTableLoader] = useState(true);
  const [data, setData] = useState([]);

  const parentElements = useMemo(() => {
    return data.filter((row) => !row[`${tableSlug}_id`]);
  }, [data, tableSlug]);

  const getAllData = async () => {
    setTableLoader(true);
    try {
      let groupFieldName = "";

      if (groupField?.id?.includes("#"))
        groupFieldName = `${groupField.id.split("#")[0]}_id`;
      if (groupField?.slug) groupFieldName = groupField?.slug;

      const { data } = await constructorObjectService.getList(tableSlug, {
        data: {
          offset: 0,
          ...filters,
          [tab?.slug]: tab?.value,
        },
      });

      setData(data.response ?? []);

      // dispatch(
      //   tableColumnActions.setList({
      //     tableSlug: tableSlug,
      //     columns: data.fields ?? [],
      //   })
      // )
    } finally {
      setTableLoader(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div>
      {(view?.quick_filters?.length > 0 ||
        (new_list[tableSlug] &&
          new_list[tableSlug].some((i) => i.checked))) && (
        <div className={styles.filters}>
          <p>Фильтры</p>
          <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
        </div>
      )}
      {tableLoader ? (
        <PageFallback />
      ) : (
        <>
          {parentElements?.map((row) => (
            <RecursiveBlock
              key={row.guid}
              row={row}
              view={view}
              data={data}
              setData={setData}
              fieldsMap={fieldsMap}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TreeView;
