import { Drawer } from "@mui/material";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import TableRowButton from "../../../../../components/TableRowButton";
import constructorCustomEventService from "../../../../../services/constructorCustomEventService";
import ActionSettings from "./ActionSettings";

const Actions = ({ mainForm }) => {
  const [drawerState, setDrawerState] = useState(null);
  const [loader, setLoader] = useState(false);

  const openEditForm = (row, index) => {
    setDrawerState(row);
  };

  const {
    fields: actions,
    remove,
    append,
    update,
  } = useFieldArray({
    control: mainForm.control,
    name: "actions",
    keyName: "key",
  });

  const onCreate = (data) => {
    append(data);
  };

  const onUpdate = (data) => {
    const index = actions?.findIndex((action) => action.id === data.id);
    update(index, data);
  };

  const deleteAction = (row, index) => {
    setLoader(true);
    constructorCustomEventService
      .delete(row.id)
      .then((res) => remove(index))
      .finally(() => setLoader(false));
  };

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Label",
        slug: "label",
      },
      // {
      //   id: 2,
      //   label: "Event path",
      //   slug: "event_path",
      // },
    ],
    []
  );

  return (
    <TableCard>
      <DataTable
        data={actions}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={loader}
        onDeleteClick={deleteAction}
        onEditClick={openEditForm}
        dataLength={1}
        disableFilters
        additionalRow={
          <TableRowButton
            colSpan={columns.length + 2}
            onClick={() => setDrawerState("CREATE")}
          />
        }
      />

      <Drawer
        open={!!drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal"
      >
        <ActionSettings
          action={drawerState}
          closeSettingsBlock={() => setDrawerState(null)}
          formType={drawerState}
          height={`calc(100vh - 48px)`}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      </Drawer>
    </TableCard>
  );
};

export default Actions;
