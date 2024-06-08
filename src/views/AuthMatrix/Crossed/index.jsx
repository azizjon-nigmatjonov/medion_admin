import { Card } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CreateButton from "../../../components/Buttons/CreateButton";
import Header from "../../../components/Header";
import IntegrationsTable from "./Integrations/Table";
import RolesTable from "./Roles/Table";
import UsersTable from "./Users/Table";

const CrossedPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      title: "Roles",
      btnTitle: "Create role",
      createPageLink: `${pathname}/role/create`,
    },
    {
      title: "Users",
      btnTitle: "Create user",
      createPageLink: `${pathname}/user/create`,
    },
    {
      title: "Integrations",
      btnTitle: "Create integration",
      createPageLink: `${pathname}/integration/create`,
    },
  ];

  return (
    <div className="UsersPage">
      <Header
        title={tabs[selectedTab]?.title}
        backButtonLink={`/settings/auth/matrix/${projectId}`}
        extra={
          <CreateButton
            onClick={() => navigate(tabs[selectedTab]?.createPageLink)}
            title={tabs[selectedTab]?.btnTitle}
          />
        }
      />

      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div style={{ padding: "20px" }}>
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>Roles</Tab>
              <Tab>Users</Tab>
              <Tab>Integrations</Tab>
            </TabList>

            <TabPanel>
              <RolesTable />
            </TabPanel>
            <TabPanel>
              <UsersTable />
            </TabPanel>
            <TabPanel>
              <IntegrationsTable />
            </TabPanel>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default CrossedPage;
