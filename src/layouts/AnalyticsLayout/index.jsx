import { Dashboard } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import RouterTabsBlock from "./RouterTabsBlock";
import styles from "./style.module.scss";

const elements = [
  {
    id: "dashboard",
    title: "Касса",
    path: "/analytics/dashboard",
    icon: Dashboard,
  },
];

const AnalyticsLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar elements={elements} />
      <div className={styles.content}>
        <RouterTabsBlock />

        <Outlet />
      </div>
    </div>
  );
};

export default AnalyticsLayout;
