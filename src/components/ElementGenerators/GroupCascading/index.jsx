import { useEffect, useMemo } from "react";
import { useState } from "react";
import PageFallback from "../../../components/PageFallback";
import constructorObjectService from "../../../services/constructorObjectService";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useTabRouter from "../../../hooks/useTabRouter";
import GroupCascadingLink from "./GroupCascadingLink";
import { Menu, TextField, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SearchIcon } from "../../../assets/icons/icon.jsx";
import IconGenerator from "../../IconPicker/IconGenerator";
import SearchInput from "../../SearchInput";

const GroupCascading = ({
  field,
  value,
  setValue,
  setFormValue,
  tableSlug,
}) => {
  const { navigateToForm } = useTabRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [data, setData] = useState([]);
  const [relTableSLug, setRelTableSlug] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [menu, setMenu] = useState(null);
  const open = Boolean(menu);
  const handleClick = (e) => setMenu(e.currentTarget);
  const handleClose = (e) => {
    setMenu(null);
    setSelectedIds([]);
    setServiceData([]);
  };

  const currentList = useMemo(() => {
    if (!selectedIds?.length) {
      return data.filter(
        (row) => !row[`${field?.attributes?.cascading_tree_table_slug}_id`]
      );
    } else {
      return data.filter(
        (el) =>
          el[`${field?.attributes?.cascading_tree_table_slug}_id`] ===
          selectedIds[selectedIds.length - 1]
      );
    }
  }, [data, selectedIds, field?.attributes?.cascading_tree_table_slug]);

  //=========COMPUTED VALUE=========
  const computedValue = useMemo(() => {
    let val = "";
    const slugs = field?.attributes?.view_fields?.map((i) => i.slug);

    if (Array.isArray(value)) {
      if (typeof value?.[0] === "string") {
        const object = data?.find((item) => item?.guid === value?.[0]);
        slugs?.map(
          (item) => (val += " " + value?.length > 0 ? object?.[item] : "")
        );
      } else {
        return slugs?.map(
          (item) => (val += " " + value?.length > 0 ? value?.[0]?.[item] : "")
        );
      }
    }
    return val;
  }, [value, data, field]);

  const backIcon = useMemo(() => {
    if (!selectedIds?.length) {
      return true;
    } else {
      return false;
    }
  }, [selectedIds]);

  const getAllData = async () => {
    // setTableLoader(true);
    try {
      const { data } = await constructorObjectService.getList(
        field?.attributes?.cascading_tree_table_slug,
        {
          data: {
            name: searchText,
          },
        }
      );

      setData(data.response ?? []);
    } finally {
      // setTableLoader(false);
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
    setRelTableSlug(
      field?.table_slug ? field?.table_slug : field?.id.split("#")?.[0]
    );
  }, [searchText]);

  return (
    <div>
      <div className={styles.input_wrapper}>
        <TextField
          required
          fullWidth
          id="password"
          onClick={handleClick}
          value={computedValue ?? ""}
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
        {computedValue.some((item) => item !== "") && (
          <button
            className={styles.close_btn}
            onClick={(e) => {
              e.stopPropagation();
              setValue(null);
            }}
          >
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
              <div className={styles.cascading_search}>
                <button className={styles.search_icon}>
                  <SearchIcon />
                </button>
                <SearchInput
                  size="small"
                  fullWidth
                  onChange={setSearchText}
                  value={searchText}
                />
              </div>

              <div className={styles.tree_data_wrapper}>
                {(searchText
                  ? selectedIds.length
                    ? data.filter(
                        (el) =>
                          el[
                            `${field?.attributes?.cascading_tree_table_slug}_id`
                          ] === selectedIds[selectedIds.length - 1]
                      )
                    : data
                  : currentList
                )?.map((item, index) => (
                  <GroupCascadingLink
                    tableSlug={field?.attributes?.cascading_tree_table_slug}
                    fieldSlug={field?.attributes?.cascading_tree_field_slug}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    item={item}
                    data={data}
                    setData={setData}
                    field={field}
                    handleClose={handleClose}
                    relTableSLug={relTableSLug}
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

export default GroupCascading;
