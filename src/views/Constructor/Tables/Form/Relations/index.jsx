import { Add } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import { CTableCell, CTableRow } from "../../../../../components/CTable";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import constructorRelationService from "../../../../../services/constructorRelationService";
import { generateGUID } from "../../../../../utils/generateID";
import styles from "../Fields/style.module.scss";
import { Drawer } from "@mui/material";
import RelationSettings from "./RelationSettings";
import TableRowButton from "../../../../../components/TableRowButton";

const Relations = ({ mainForm, getRelationFields }) => {
  const [drawerState, setDrawerState] = useState(null);
  const [loader, setLoader] = useState(false);

  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "relations",
    keyName: "key",
  });

  const { id } = useParams();

  const openEditForm = (field, index) => {
    setDrawerState(field);
  };

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    setDrawerState(null);
    setLoader(false);
  };

  const deleteField = (field, index) => {
    if (!id) updateRelations();
    else {
      constructorRelationService
        .delete(field.id)
        .then((res) => updateRelations());
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Table from",
        slug: "table_from.label",
      },
      {
        id: 2,
        label: "Table to",
        slug: "table_to.label",
      },
      {
        id: 3,
        label: "Relation type",
        slug: "type",
      },
    ],
    []
  );

  return (
    <TableCard>
      <DataTable
        data={relations}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={loader}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        dataLength={1}
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
        <RelationSettings
          relation={drawerState}
          closeSettingsBlock={() => setDrawerState(null)}
          getRelationFields={getRelationFields}
          formType={drawerState}
          height={`calc(100vh - 48px)`}
        />
      </Drawer>
    </TableCard>
  );
};

export default Relations;
