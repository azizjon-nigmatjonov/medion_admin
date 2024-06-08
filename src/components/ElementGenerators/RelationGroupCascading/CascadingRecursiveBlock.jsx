import { get } from "@ngard/tiny-get";
import { useMemo } from "react";
import style from "./style.module.scss";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import { numberWithSpaces } from "../../../utils/formatNumbers";

const CascadingRecursiveBlock = ({
  data = [],
  item,
  tableSlug,
  selectedIds,
  setSelectedIds,
  handleClose,
  field,
  serviceData,
  setValue,
  setFormValue,
  index,
  searchText,
}) => {
  const children = useMemo(() => {
    return data.filter((el) => el[`${tableSlug}_id`] === item?.guid);
  }, [data, item, tableSlug]);
  const foundServices = useMemo(() => {
    if (!searchText) return [];
    return serviceData?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }, [searchText, serviceData]);


  const setServices = (element) => {
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
                setServices(item)
              }}
            >
              <div className={style.cascading_link_folder}>
                <span className={style.cascading_folder} onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIds([...selectedIds, item?.guid]);
                }}>
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
                  setServices(item);
                  e.stopPropagation();
                }}
              >
                <div className={style.cascading_link_item}>
                  <span>
                    <DescriptionIcon style={{ color: "#6E8BB7" }} />
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
                      <span>{`${element?.name} ${
                        element?.first_price
                          ? numberWithSpaces(element?.first_price)
                          : ""
                      }`}</span>
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
                        element?.first_price
                          ? numberWithSpaces(element?.first_price)
                          : ""
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

export default CascadingRecursiveBlock;
