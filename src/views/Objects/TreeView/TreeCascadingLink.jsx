import React, { useState, useMemo } from "react";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import styles from "./style.module.scss";
import FolderIcon from "@mui/icons-material/Folder";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { Add, Delete } from "@mui/icons-material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

function TreeCascadingLink({
  tableSlug,
  selectedIds,
  setSelectedIds,
  item,
  data,
  setData,
}) {
  const { navigateToForm } = useTabRouter();
  const [deleteLoader, setDeleteLoader] = useState(false);

  const navigateToEditPage = () => {
    navigateToForm(tableSlug, "EDIT", item);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug, "CREATE", null, {
      [`${tableSlug}_id`]: item?.guid,
    });
  };
  const children = useMemo(() => {
    return data.filter((el) => el[`${tableSlug}_id`] === item.guid);
  }, [data, tableSlug, item]);

  const deleteHandler = async () => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, item?.guid);
      setData((prev) => prev.filter((el) => el.guid !== item?.guid));
      setDeleteLoader(false);
    } catch {
      setDeleteLoader(false);
    }
  };
  return (
    <div className={styles.cascading_link} onClick={navigateToEditPage}>
      <div className={styles.head_section}>
        {children?.length ? (
          <button
            className={styles.folder_icon}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIds([...selectedIds, item?.guid]);
            }}
          >
            <FolderIcon style={{ color: "#6E8BB7" }} />
          </button>
        ) : (
          <span onClick={(e) => e.stopPropagation()}>
            <TextSnippetIcon style={{ color: "#6E8BB7" }} />
          </span>
        )}

        <h4>{item?.name}</h4>
      </div>
      <div className={styles.extra}>
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
  );
}

export default TreeCascadingLink;
