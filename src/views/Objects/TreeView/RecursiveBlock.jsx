import { Add, Delete } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useState } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import CollapseIcon from "../../../components/CollapseIcon";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import style from "./style.module.scss";

const RecursiveBlock = ({
  row,
  view,
  data = [],
  setData,
  level = 1,
  fieldsMap,
}) => {
  const { tableSlug } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const { navigateToForm } = useTabRouter();

  const children = useMemo(() => {
    return data.filter((el) => el[`${tableSlug}_id`] === row.guid);
  }, [data, row, tableSlug]);

  const switchChildBlock = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug, "CREATE", null, {
      [`${tableSlug}_id`]: row.guid,
    });
  };

  const navigateToEditPage = () => {
    navigateToForm(tableSlug, "EDIT", row);
  };

  const deleteHandler = async (id) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      setData((prev) => prev.filter((el) => el.guid !== row.guid));
    } catch {
      setDeleteLoader(false);
    }
  };

  return (
    <>
      <div
        onClick={navigateToEditPage}
        className={`${style.recursiveBlock} ${style[`level${level}`]}`}
        style={{ paddingLeft: 15 * level }}
      >
        {children?.length ? (
          <CollapseIcon isOpen={childBlockVisible} onClick={switchChildBlock} />
        ) : (
          <div className="mr-2"></div>
        )}

        <div className={style.title}>
          {view?.columns?.map((fieldId) => {
            const fieldSlug = fieldsMap?.[fieldId]?.slug;
            return `${get(row, fieldSlug, "")} `;
          })}
        </div>

        <div className={style.extra}>
          <RectangleIconButton color="primary" onClick={navigateToCreatePage}>
            <Add color="primary" />
          </RectangleIconButton>
          <RectangleIconButton
            color="error"
            loader={deleteLoader}
            onClick={deleteHandler}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </div>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {children?.map((childRow) => (
          <RecursiveBlock
            key={childRow.guid}
            row={childRow}
            data={data}
            view={view}
            level={level + 1}
            setData={setData}
            fieldsMap={fieldsMap}
          />
        ))}
      </Collapse>
    </>
  );
};

export default RecursiveBlock;
