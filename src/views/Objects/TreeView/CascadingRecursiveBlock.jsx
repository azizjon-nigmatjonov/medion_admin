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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import style from "./style.module.scss";
import { SearchIcon } from "../../../../src/assets/icons/icon.jsx";
import { StylesContext } from "@mui/styles";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

const CascadingRecursiveBlock = ({
  row,
  view,
  data = [],
  setData,
  level = 1,
  fieldsMap,
  setCurrentLevel,
  currentLevel,
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
    setCurrentLevel(level + 1);
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
      {currentLevel === level && (
        <div className={style.cascading_recursive}>
          {/* <div className={style.cascading_recursive_it0em}></div> */}

          {children?.length ? (
            <div className={style.cascading_link} onClick={navigateToEditPage}>
              <div className={style.cascading_link_item}>
                <span onClick={switchChildBlock}>
                  <FolderIcon style={{ color: "#6E8BB7" }} />
                </span>
                <span> {row?.name}</span>
              </div>
              <div className={style.extra}>
                <RectangleIconButton
                  color="primary"
                  onClick={navigateToCreatePage}
                >
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
          ) : (
            <div className={style.cascading_link}>
              <div className={style.cascading_link_item}>
                <span>
                  <DescriptionIcon style={{ color: "#6E8BB7" }} />
                </span>
                <span> {row?.name}</span>
              </div>
              <div className={style.extra}>
                <RectangleIconButton
                  color="primary"
                  onClick={navigateToCreatePage}
                >
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
          )}
        </div>
      )}
    </>
  );
};

export default CascadingRecursiveBlock;
