import { Delete } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import DeleteWrapperModal from "../../../components/DeleteWrapperModal";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import HFSwitch from "../../../components/FormElements/HFSwitch";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import applicationService from "../../../services/applicationSercixe";
import constructorTableService from "../../../services/constructorTableService";
import ImportModal from "./ImportModal";

const TablesList = ({ mainForm, appData, getData, setIds }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [modalLoader, setModalLoader] = useState();

  const { fields: list, remove } = useFieldArray({
    control: mainForm.control,
    name: "tables",
    keyName: "key",
  });

  const navigateToEditForm = (id, slug) => {
    navigate(`${location.pathname}/objects/${id}/${slug}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/objects/create`);
  };

  const openImportModal = () => {
    setImportModalVisible(true);
  };

  const closeImportModal = () => {
    setImportModalVisible(false);
  };

  const importTable = (checkedElements = []) => {
    setModalLoader();

    const computedTables = [
      ...list.map((el) => ({
        table_id: el.id,
        is_visible: Boolean(el.is_visible),
        is_own_table: Boolean(el.is_own_table),
      })),
      ...checkedElements.map((el) => ({
        table_id: el,
        is_visible: true,
        is_own_table: false,
      })),
    ];

    applicationService
      .update({
        ...appData,
        tables: computedTables,
      })
      .then(() => {
        closeImportModal();
        getData();
      })
      .finally(() => setModalLoader(false));
  };

  const deleteTable = async (id) => {
    setLoader(true);

    const index = list?.findIndex((table) => table.id === id);

    const computedTableIds =
      list
        ?.filter((table) => table.id !== id)
        .map((table) => ({
          table_id: table.id,
          is_visible: Boolean(table.is_visible),
          is_own_table: Boolean(table.is_own_table),
        })) ?? [];

    try {
      if (list[index]?.is_own_table) await constructorTableService.delete(id);
      else {
        await applicationService.update({
          ...appData,
          tables: computedTableIds,
        });
      }
      remove(index);
    } finally {
      setLoader(false);
    }
  };

  // Checkbox function Many2Many
  // const onChecked = (id) => {
  //   setIds((prev) => {
  //     if (prev.includes(id)) {
  //       return prev.filter((items) => items !== id);
  //     } else {
  //       return [...prev, id];
  //     }
  //   });
  // };

  const switchChangeHandler = (val, index) => {
    const computedTableIds = mainForm
      .getValues("tables")
      ?.map((table, tableIndex) => {
        return {
          table_id: table.id,
          is_visible: tableIndex !== index ? Boolean(table.is_visible) : val,
          is_own_table: Boolean(table.is_own_table),
        };
      });
    applicationService.update({
      ...appData,
      tables: computedTableIds,
    });
  };

  return (
    <>
      {importModalVisible && (
        <ImportModal
          closeModal={closeImportModal}
          importTable={importTable}
          btnLoader={modalLoader}
        />
      )}
      <TableCard>
        <CTable disablePagination removableHeight={120}>
          <CTableHead>
            {/* <CTableCell></CTableCell> */}
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Название</CTableCell>
            <CTableCell>Описание</CTableCell>
            <CTableCell width={60}>Показать в меню</CTableCell>
            <CTableCell width={60} />
          </CTableHead>
          <CTableBody columnsCount={4} dataLength={1} loader={loader}>
            {list?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id, element.slug)}
              >
                {/* <CTableCell width={5}>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onChecked(element?.id)}
                  />
                </CTableCell> */}
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element.label}</CTableCell>
                <CTableCell>{element.description}</CTableCell>
                <CTableCell>
                  <HFSwitch
                    onClick={(e) => e.stopPropagation()}
                    control={mainForm.control}
                    name={`tables[${index}].is_visible`}
                    onChange={(val) => switchChangeHandler(val, index)}
                  />
                </CTableCell>
                <CTableCell>
                  <DeleteWrapperModal id={element.id} onDelete={deleteTable}>
                    <RectangleIconButton color="error">
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
              </CTableRow>
            ))}

            <TableRowButton
              colSpan={5}
              onClick={openImportModal}
              title="Импортировать из других приложений"
            />
            <TableRowButton
              colSpan={5}
              onClick={navigateToCreateForm}
              title="Создать новый"
            />
          </CTableBody>
        </CTable>
      </TableCard>
    </>
  );
};

export default TablesList;
