import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Add } from "@mui/icons-material";

import { CTableCell, CTableRow } from "../../../../../components/CTable";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import eventService from "../../../../../services/eventsService";
import ActionForm from "./ActionForm";
import styles from "./styles.module.scss";

const Actions = ({ eventLabel }) => {
  const { slug } = useParams();
  const [modalItemId, setModalItemId] = useState(undefined);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const {
    data: events,
    isLoading,
    refetch: eventsRefetch,
  } = useQuery(
    ["GET_EVENTS_LIST", slug],
    () => eventService.getList({ table_slug: slug }),
    {
      enabled: !!slug,
    }
  );

  const columns = [
    {
      id: 1,
      label: "Событие",
      slug: "when.action",
    },
  ];

  const deleteField = (state) => {
    if (state?.id) {
      eventService.delete(state.id).then(() => eventsRefetch());
    }
  };

  return (
    <TableCard>
      <DataTable
        data={events?.events}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={isLoading}
        dataLength={1}
        onDeleteClick={deleteField}
        onEditClick={(e) => {
          handleOpen();
          setModalItemId(e?.id);
        }}
        additionalRow={
          <CTableRow>
            <CTableCell colSpan={columns.length + 2}>
              <div
                className={styles.createButton}
                onClick={() => {
                  handleOpen();
                  setModalItemId("");
                }}
              >
                <Add color="primary" />
                <p>Добавить</p>
              </div>
            </CTableCell>
          </CTableRow>
        }
      />
      <ActionForm
        modalItemId={modalItemId}
        eventLabel={eventLabel}
        isOpen={isOpen}
        eventsRefetch={eventsRefetch}
        handleClose={handleClose}
      />
    </TableCard>
  );
};

export default Actions;
