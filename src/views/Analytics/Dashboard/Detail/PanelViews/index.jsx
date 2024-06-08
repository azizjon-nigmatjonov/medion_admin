import { useMemo } from "react";
import DataTable from "../../../../../components/DataTable";
import BarChart from "./BarChart";
import Card from "./Card";
import FunnelChart from "./FunnelChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import PivotTable from "./PivotTable";

const PanelViews = ({ panel = {}, data = {}, isLoading }) => {
  const columns = useMemo(() => {
    if (!data?.rows?.length) return [];

    return Object.keys(data.rows[0])?.map((key) => ({
      id: key,
      label: key,
      slug: key,
    }));
  }, [data]);

  switch (panel.attributes?.type) {
    case "BAR_CHART":
      return <BarChart data={data?.rows} panel={panel} />;

    case "PIE_CHART":
      return <PieChart data={data?.rows} panel={panel} />;

    case "FUNNEL_CHART":
      return <FunnelChart data={data?.rows} panel={panel} />;

    case "LINE_CHART":
      return <LineChart data={data?.rows} panel={panel} />;

    case "CARD":
      return <Card data={data?.rows} panel={panel} />;
    case "PIVOT_TABLE":
      return <PivotTable data={data?.rows} panel={panel} />;

    default:
      return (
        <DataTable
          loader={isLoading}
          data={data?.rows}
          columns={columns}
          disablePagination
          // removableHeight={500}
          disableFilters
          wrapperStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 10,
            minHeight: "100px",
          }}
          // tableStyle={{ flex: 1 }}
        />
      );
  }
};

export default PanelViews;
