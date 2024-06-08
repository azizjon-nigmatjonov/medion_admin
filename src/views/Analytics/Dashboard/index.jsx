import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/DataTable";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import useAnalyticsTabRouter from "../../../hooks/useAnalyticsTabRouter";
import dashboardService from "../../../services/analytics/dashboardService";

const columns = [
  {
    id: 1,
    label: "Название",
    slug: "name",
    type: "SINGLE_LINE",
  },
];

const DashboardList = () => {
  const navigate = useNavigate();
  const { navigateToForm } = useAnalyticsTabRouter();

  const { data, isLoading, refetch } = useQuery(["GET_DASHBOARD_LIST"], () => {
    return dashboardService.getList();
  });

  const { mutate, isLoading: deleteLoading } = useMutation(
    (row) => {
      return dashboardService.delete(row.id);
    },
    {
      onSuccess: () => refetch(),
    }
  );

  const navigateToCreateForm = () => {
    navigateToForm("", "CREATE");
  };

  const navigateToDetailPage = (row) => {
    navigate(`/analytics/dashboard/${row.id}`);
  };

  return (
    <div>
      <TableCard>
        <DataTable
          removableHeight={"auto"}
          columns={columns}
          data={data?.dashboards}
          loader={isLoading || deleteLoading}
          onDeleteClick={mutate}
          disablePagination
          onRowClick={navigateToDetailPage}
          additionalRow={
            <TableRowButton
              onClick={navigateToCreateForm}
              colSpan={columns.length + 2}
            />
          }
        />
      </TableCard>
    </div>
  );
};

export default DashboardList;
