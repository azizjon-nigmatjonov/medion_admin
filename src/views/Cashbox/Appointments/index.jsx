import { Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import TableCard from "../../../components/TableCard"
import CashboxAppointMentsTable from "./Table"

const CashboxAppointments = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const navigateToClosingPage = () => {
    navigate("/cashbox/closing")
  }

  return (
    <div>
      {/* <Tabs
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        direction={"ltr"}
      >
        <TableCard>
          <TabList>
            <Tab>Онлайн</Tab>
            <Tab>Офлайн</Tab>
          </TabList>
          <TabPanel>
            <CashboxAppointMentsTable tableSlug="booked_appointments" type={"online"}  />
          </TabPanel>
          <TabPanel> */}
          <TableCard extra={<SecondaryButton onClick={navigateToClosingPage} >Закрыть кассу</SecondaryButton>} >
            <CashboxAppointMentsTable tableSlug="offline_appointments" type={"offline"} />
          </TableCard>
          {/* </TabPanel>
        </TableCard>
      </Tabs> */}
    </div>
  )
}

export default CashboxAppointments
