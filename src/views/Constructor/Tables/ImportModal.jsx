import { Checkbox } from "@mui/material"
import { useMemo } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import CSelect from "../../../components/CSelect"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable"
import FRow from "../../../components/FormElements/FRow"
import LargeModalCard from "../../../components/LargeModalCard"
import useWatch from "../../../hooks/useWatch"
import applicationService from "../../../services/applicationSercixe"
import listToOptions from "../../../utils/listToOptions"

const ImportModal = ({ closeModal, btnLoader, importTable }) => {
  const [loader, setLoader] = useState(false)

  const applications = useSelector((state) => state.application.list)

  const [selectedApplication, setSelectedApplication] = useState(null)
  const [checkedElements, setCheckedElements] = useState([])
  const [tables, setTables] = useState([])

  const computedApplicationsList = useMemo(() => {
    return listToOptions(applications, "name")
  }, [applications])

  const getTablesList = () => {
    setLoader(true)

    applicationService
      .getById(selectedApplication)
      .then((res) => setTables(res.tables ?? []))
      .finally(() => setLoader(false))
  }

  useWatch(() => {
    getTablesList()
  }, [selectedApplication])

  const onCheck = (e, id) => {
    if (e.target.checked) {
      setCheckedElements([...checkedElements, id])
    } else {
      setCheckedElements(checkedElements.filter((element) => element !== id))
    }
  }

  const onSubmit = () => {importTable(checkedElements)}

  return (
    <LargeModalCard
      title={"Import Table"}
      btnLoader={btnLoader}
      oneColumn
      onSaveButtonClick={onSubmit}
      onClose={closeModal}
    >
      <div className="flex align-center gap-2 mb-2">
        <FRow label={"Application"}>
          <CSelect
            value={selectedApplication}
            onChange={(e) => setSelectedApplication(e.target.value)}
            options={computedApplicationsList}
            placeholder="Select app"
            disabledHelperText
          />
        </FRow>
      </div>

      <CTable removableHeight={false} disablePagination>
        <CTableHead>
          <CTableCell width={70}></CTableCell>
          <CTableCell width={10}>№</CTableCell>
          <CTableCell>Label</CTableCell>
          <CTableCell>Description</CTableCell>
        </CTableHead>

        <CTableBody columnsCount={4} dataLength={tables.length} loader={loader} >
          {tables.map((row, rowIndex) => (
            <CTableRow
              key={row.id}
              // onClick={() => navigateToEditPage(row.guid)}
            >
              <CTableCell style={{ padding: "0 16px" }}>
                <Checkbox
                  onChange={(e) => onCheck(e, row.id)}
                  checked={checkedElements.includes(row.id)}
                />
              </CTableCell>
              <CTableCell>{rowIndex + 1}</CTableCell>
              <CTableCell className="text-nowrap">{row.label}</CTableCell>
              <CTableCell className="text-nowrap">{row.description}</CTableCell>

              {/* <CTableCell>
              <DeleteWrapperModal id={row.guid} onDelete={deleteHandler}>
                <RectangleIconButton
                  color="error"
                  // onClick={() => deleteHandler(row.guid)}
                >
                  <Delete color="error" />
                </RectangleIconButton>
              </DeleteWrapperModal>
            </CTableCell> */}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </LargeModalCard>
  )
}

export default ImportModal
