import { ArrowBack, Close } from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import useDebounce from "../../../hooks/useDebounce";
import constructorObjectService from "../../../services/constructorObjectService";
import { getLabelWithViewFields } from "../../../utils/getRelationFieldLabel";
import IconGenerator from "../../IconPicker/IconGenerator";
import SearchInput from "../../SearchInput";
import styles from "./style.module.scss";

const Dropdown = ({ field, closeMenu, onObjectSelect, tablesList }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchText, setSearchText] = useState("");

  const inputChangeHandler = useDebounce((val) => setSearchText(val), 300);

  const viewFields = useMemo(() => {
    if (!selectedTable) return [];
    return selectedTable.view_fields?.map((field) => field.slug);
  }, [selectedTable]);

  const queryPayload = {
    limit: 10,
    offset: 0,
    view_fields: viewFields,
    search: searchText,
  };

  const { data: objectsList = [], isLoading: loader } = useQuery(
    ["GET_OBJECT_LIST_QUERY", selectedTable?.slug, queryPayload],
    () => {
      if (!selectedTable?.slug) return null;
      return constructorObjectService.getList(selectedTable?.slug, {
        data: queryPayload,
      });
    },
    {
      select: (res) => {
        return (
          res?.data?.response?.map((el) => ({
            value: el.guid,
            label: getLabelWithViewFields(selectedTable.view_fields, el),
          })) ?? []
        );
      },
    }
  );

  useEffect(() => {
    setSearchText("");
  }, [selectedTable]);

  return (
    <>
      <div className={styles.menuHeader}>
        {selectedTable ? (
          <IconButton color="primary" onClick={() => setSelectedTable(null)}>
            <ArrowBack />
          </IconButton>
        ) : (
          <div></div>
        )}

        {selectedTable?.label}

        <IconButton onClick={closeMenu}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.menuBody}>
        {selectedTable && (
          <div className={styles.menuRow}>
            <SearchInput size="small" fullWidth onChange={inputChangeHandler} />
          </div>
        )}

        {!selectedTable ? (
          <>
            {tablesList.map((table) => (
              <div
                key={table.id}
                className={styles.menuRow}
                onClick={() => setSelectedTable(table)}
              >
                <IconGenerator icon={table.icon} />
                {table.label}
              </div>
            ))}
          </>
        ) : (
          <>
            {loader ? (
              <div className="flex align-center justify-center p-2 ">
                <CircularProgress />
              </div>
            ) : (
              <div className={styles.menu_body}>
                {objectsList?.map((object) => (
                  <div
                    key={object.id}
                    className={styles.menuRow}
                    onClick={() => onObjectSelect(object, selectedTable)}
                  >
                    {object.label}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* <div className={styles.menuRow}>
            <IconGenerator icon="user-doctor.svg" />
            Patients
          </div> */}
      </div>
    </>
  );
};

export default Dropdown;
