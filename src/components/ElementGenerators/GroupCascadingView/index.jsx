import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import PageFallback from "../../../components/PageFallback";
import constructorObjectService from "../../../services/constructorObjectService";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderIcon from "@mui/icons-material/Folder";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { Add, Delete } from "@mui/icons-material";
import useTabRouter from "../../../hooks/useTabRouter";
import GroupCascadingView from "./GroupCascadingView";
import FastFilter from "../../../views/Objects/components/FastFilter";
import { Menu, TextField, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SearchIcon } from "../../../assets/icons/icon.jsx";
import IconGenerator from "../../IconPicker/IconGenerator";
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel";
import { get } from "@ngard/tiny-get";
import SearchInput from "../../SearchInput";

const GroupCascadingViews = ({
  field,
  value,
  setValue,
  setFormValue,
  tableSlug,
  index,
  row,
}) => {
  const { navigateToForm } = useTabRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [tableLoader, setTableLoader] = useState(true);
  const [data, setData] = useState([]);
  const [relTableSLug, setRelTableSlug] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [chosenItem, setChosenItem] = useState();

  const [searchText, setSearchText] = useState("");
  const [menu, setMenu] = useState(null);
  const open = Boolean(menu);
  const handleClick = (e) => {
    setMenu(e.currentTarget);
    setValue("cascading_tree", []);
  };
  const handleClose = (e) => {
    setMenu(null);
    setSelectedIds([]);
    setServiceData([]);
  };
  const valuess = useMemo(() => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "");

    const result = getRelationFieldTableCellLabel(
      field,
      row,
      field.slug + "_data"
    );

    return result;
  }, [row, field]);

  const insideValue = useMemo(() => {
    let values = "";
    const slugs = field?.attributes?.view_fields?.map((i) => i.slug);
    slugs?.map((item) => (values += " " + chosenItem?.[item]));
    return values;
  }, [chosenItem, field]);

  const currentList = useMemo(() => {
    if (!selectedIds?.length) {
      return data.filter(
        (row) => !row[`${field?.attributes?.cascading_tree?.table_slug}_id`]
      );
    } else {
      return data.filter(
        (el) =>
          el[`${field?.attributes?.cascading_tree?.table_slug}_id`] ===
          selectedIds[selectedIds.length - 1]
      );
    }
  }, [data, selectedIds, field?.attributes?.cascading_tree]);

  const backIcon = useMemo(() => {
    if (!selectedIds?.length) {
      return true;
    } else {
      return false;
    }
  }, [selectedIds]);

  const getAllData = async () => {
    setTableLoader(true);
    try {
      const { data } = await constructorObjectService.getList(
        field?.attributes?.cascading_tree?.table_slug,
        {
          data: { offset: 0, limit: 10 },
        }
      );

      setData(data.response ?? []);
    } finally {
      setTableLoader(false);
    }
  };

  const backData = () => {
    setServiceData(null);
    if (selectedIds?.length > 0) {
      setSelectedIds(selectedIds.splice(0, selectedIds.length - 1));
    } else {
      setSelectedIds([]);
    }
  };
  useEffect(() => {
    getAllData();
    setRelTableSlug(field?.table_slug);
  }, []);

  return (
    <div>
      <div className={styles.input_wrapper}>
        <TextField
          required
          fullWidth
          id="password"
          onClick={handleClick}
          value={chosenItem === undefined ? valuess : insideValue}
          inputStyle={{ height: "35px" }}
          InputProps={{
            endAdornment: value && (
              <InputAdornment position="end">
                <IconGenerator
                  icon="arrow-up-right-from-square.svg"
                  style={{
                    marginLeft: "0",
                    cursor: "pointer",
                    marginRight: "40px",
                    color: "#404000",
                  }}
                  size={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigateToForm(tableSlug, "EDIT", value[0]);
                  }}
                />
              </InputAdornment>
            ),
            sx: {
              height: "37px",
            },
          }}
        />
        {menu && (
          <button className={styles.close_btn}>
            <CloseIcon />
          </button>
        )}
      </div>
      {tableLoader ? (
        <PageFallback />
      ) : (
        <>
          <Menu
            open={open}
            anchorEl={menu}
            onClose={handleClose}
            id="cascading_menu"
          >
            <div className={styles.tree_data_layer}>
              <div className={styles.cascading_head}>
                {!backIcon && (
                  <button onClick={backData}>
                    <ArrowBackIcon />
                  </button>
                )}
              </div>
              {serviceData?.length > 0 && (
                <div className={styles.cascading_search}>
                  <button className={styles.search_icon}>
                    <SearchIcon />
                  </button>
                  <SearchInput
                    size="small"
                    fullWidth
                    onChange={setSearchText}
                  />
                </div>
              )}

              <div className={styles.tree_data_wrapper}>
                {currentList?.map((item) => (
                  <GroupCascadingView
                    tableSlug={field?.attributes?.cascading_tree?.table_slug}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    item={item}
                    data={data}
                    setData={setData}
                    field={field}
                    handleClose={handleClose}
                    relTableSLug={relTableSLug}
                    setChosenItem={setChosenItem}
                    setServiceData={setServiceData}
                    serviceData={serviceData}
                    setValue={setValue}
                    setFormValue={setFormValue}
                    index={index}
                    searchText={searchText}
                  />
                ))}
              </div>
            </div>
          </Menu>
        </>
      )}
    </div>
  );
};

export default GroupCascadingViews;
