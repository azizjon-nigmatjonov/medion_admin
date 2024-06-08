import { Add, Delete } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useState } from "react";
import { useMemo } from "react";

import RectangleIconButton from "../../Buttons/RectangleIconButton";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import style from "./style.module.scss";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

const GroupCascadingView = ({
  data = [],
  setData,
  item,
  tableSlug,
  selectedIds,
  setSelectedIds,
  handleClose,
  relTableSLug,
  setChosenItem,
  setServiceData,
  field,
  serviceData,
  setValue,
  setFormValue,
  index,
  searchText,
}) => {
  const children = useMemo(() => {
    return data?.filter((el) => el[`${tableSlug}_id`] === item?.guid);
  }, [data, item, tableSlug]);

  const foundServices = useMemo(() => {
    if (!searchText) return [];
    return serviceData?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }, [searchText, serviceData]);

  const getServices = (item) => {
    constructorObjectService
      .getList(relTableSLug, {
        data: { [field?.attributes?.cascading_tree?.field_slug]: item?.guid },
      })
      .then((res) => {
        setServiceData(res?.data?.response);
      });
  };

  const setServices = (element) => {
    setChosenItem(element);
    setValue(element?.guid);

    field?.attributes?.autofill.forEach(({ field_from, field_to }) => {
      setFormValue(`multi.${index}.${field_to}`, get(element, field_from));
    });
    handleClose();
  };

  return (
    <>
      {!serviceData?.length ? (
        <div className={style.cascading_recursive}>
          {children?.length ? (
            <div
              className={style.cascading_link}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIds([...selectedIds, item?.guid]);
              }}
            >
              <div className={style.cascading_link_folder}>
                <span className={style.cascading_folder}>
                  <FolderIcon style={{ color: "#6E8BB7" }} />
                </span>
                <span> {item?.name}</span>
              </div>
            </div>
          ) : (
            <div className={style.cascading_link_wrapper}>
              <div
                className={style.cascading_link}
                onClick={(e) => {
                  e.stopPropagation();
                  getServices(item);
                }}
              >
                <div className={style.cascading_link_item}>
                  <span>
                    <FolderIcon style={{ color: "#6E8BB7" }} />
                  </span>
                  <span>{item?.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={style.cascading_recursive}>
          <div className={style.cascading_link_wrapper}>
            {searchText
              ? foundServices?.map((element) => (
                  <div
                    className={style.cascading_link}
                    onClick={() => setServices(element)}
                  >
                    <div className={style.cascading_link_item}>
                      <span>
                        <DescriptionIcon style={{ color: "#6E8BB7" }} />
                      </span>
                      <span>{element?.name}</span>
                    </div>
                  </div>
                ))
              : serviceData?.map((element) => (
                  <div
                    className={style.cascading_link}
                    onClick={() => setServices(element)}
                  >
                    <div className={style.cascading_link_item}>
                      <span>
                        <DescriptionIcon style={{ color: "#6E8BB7" }} />
                      </span>
                      <span>{`${element?.name} ${
                        element?.first_price ? element?.first_price : ""
                      }`}</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCascadingView;
