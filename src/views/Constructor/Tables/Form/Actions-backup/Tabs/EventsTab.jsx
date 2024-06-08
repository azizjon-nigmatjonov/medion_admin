import { useMemo } from "react";
import DataTable from "../../../../../../components/DataTable";

const EventsTab = () => {
  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "ID",
        slug: "when.action",
      },
      {
        id: 2,
        label: "Дата",
        slug: "when.app_slug",
      },
      {
        id: 3,
        label: "C какого обекта",
        slug: "when.table_slug",
      },
      {
        id: 4,
        label: "На какой обект",
        slug: "when.table_slug",
      },
    ],
    []
  );

  return (
    <div style={{ padding: "8px 13px" }}>
      <DataTable
        data={[]}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={false}
        dataLength={1}
      />
    </div>
  );
};

export default EventsTab;
