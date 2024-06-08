



import { CircularProgress, MenuItem } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import ButtonsPopover from "../../../components/ButtonsPopover"
import clientTypeService from "../../../services/auth/clientTypeService"
import RelationCreateRow from "./RelationCreateRow"
import TableCreateRow from "./TableCreateRow"

const TablesRow = ({ table, index, data, setTables }) => {

  const [loader, setLoader] = useState(false)
  const [btnLoader, setBtnLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)

    const deleteTable = () => {

      const computedData = {
        ...data,
        tables: data.tables.filter((item, i) => i !== index)
      }

      setLoader(true)
      clientTypeService
        .update(computedData)
        .then((res) => {
          setTables(res.tables ?? [])
        })
        .catch(() => setLoader(false))
    }

  const updateTable = (values) => {

    const computedData = {
      ...data,
      tables: data.tables?.map((el, i) => {
        if(i !== index) return el
        return {
          ...el,
          ...values
        }
      })
    }

    setLoader(true)
    clientTypeService
      .update(computedData)
      .then((res) => {
        setTables(res.tables ?? [])
        setTextFieldVisible(false)
      })
      .catch(() => setLoader(false))
  }

  return (
    <MenuItem
      className={`row silver-bottom-border pointer`}
    >
      {!textFieldVisible && <div className="row-index">{index + 1}</div>}
      {textFieldVisible ? (
        <TableCreateRow
          color="primary"
          initialValues={table}
          onSubmit={updateTable}
          btnText="SAVE"
          loader={btnLoader}
        />
      ) : (
        <>
          <div className="row-label">{table?.label}</div>
          <div className="row-btns">
            {loader ? (
              <div style={{ padding: "12px" }}>
                <CircularProgress disableShrink size={20} />
              </div>
            ) : (
              <ButtonsPopover
                onDeleteClick={deleteTable}
                onEditClick={() => setTextFieldVisible(true)}
              />
            )}
          </div>
        </>
      )}
    </MenuItem>
  )
}

export default TablesRow
