import { Button, Card } from "@mui/material"
import CreateButton from "../../components/Buttons/CreateButton"
import FiltersBlock from "../../components/FiltersBlock"
import Header from "../../components/Header"
import SearchInput from "../../components/SearchInput"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useState } from "react"
import TabCounter from "../../components/TabCounter"
import DocsTable from "./Table"

const DocListPage = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div>
      <Header
        title="Входящие документы"
        extra={<CreateButton title="Создать" />}
      />
      <FiltersBlock>
        <SearchInput />
        <Button
          startIcon={<FilterAltIcon />}
          variant="contained"
          color="primary"
        >
          Фильтр
        </Button>
      </FiltersBlock>

      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div className="table-block">
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>
                Счета-фактуры <TabCounter count={20} />
              </Tab>
              <Tab>
                Доверенности <TabCounter count={45} />
              </Tab>
              <Tab>
                ТТН <TabCounter count={59} />
              </Tab>
              <Tab>
                Акты <TabCounter count={12} />
              </Tab>
              <Tab>
                Договоры <TabCounter count={34} />
              </Tab>
              <Tab>
                Акты сверки <TabCounter count={12} />
              </Tab>
            </TabList>

            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>
            <TabPanel>
              <DocsTable />
            </TabPanel>


          </Card>
        </div>
      </Tabs>
    </div>
  )
}

export default DocListPage
