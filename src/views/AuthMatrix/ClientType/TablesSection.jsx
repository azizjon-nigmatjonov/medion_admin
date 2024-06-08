
import { Collapse } from "@mui/material"
import { useState } from "react"
import RowLinearLoader from "../../../components/RowLinearLoader"
import CreateRowButton from "../../../components/CreateRowButton"
import { useParams } from "react-router-dom"
import clientRelationService from "../../../services/auth/clientRelationService"
import RelationCreateRow from "./RelationCreateRow"
import RelationsRow from "./RelationsRow"
import TableCreateRow from "./TableCreateRow"
import clientTypeService from "../../../services/auth/clientTypeService"
import TablesRow from "./TablesRow"

const TablesSection = ({ data = {}, loader, tables, setTables }) => {
  const { typeId } = useParams()


  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)

  const createNewTable = (values) => {
    const computedData = {
      ...data,
      tables: [
        ...tables,
        values
      ]
    }
    
    setCreateLoader(true)
    clientTypeService
      .update(computedData)
      .then((res) => {
        setCreateFormVisible(false)
        setTables(res.tables ?? [])
      })
      .catch(() => setCreateLoader(false))
  }

  return (
    <>
      <div className="card silver-right-border" style={{ flex: 1 }}>
        <div className="card-header silver-bottom-border">
          <div className="card-title">TABLES</div>
          <div className="card-extra">
            <CreateRowButton
              formVisible={createFormVisible}
              setFunction={setCreateFormVisible}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>

        <Collapse in={createFormVisible} className="silver-bottom-border"  >
          <TableCreateRow
            onSubmit={createNewTable}
            loader={createLoader}
            setLoader={setCreateLoader}
            visible={createFormVisible}
            setVisible={setCreateFormVisible}
          />
        </Collapse>

        {tables?.map((table, index) => (
          <TablesRow
            // setRelationsList={setRelationsList}
            key={table.slug}
            table={table}
            index={index}
            setTables={setTables}
            data={data}
          />
        ))}
      </div>
    </>
  )
}

export default TablesSection
