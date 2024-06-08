import { useEffect, useEffectxe, useState } from "react"
import DataTable from "../../../components/DataTable"
import useCashboxTabRouter from "../../../hooks/useCashboxTabRouter"
import useDebouncedWatch from "../../../hooks/useDebouncedWatch"
import offlineAppointmentsService from "../../../services/cashbox/offlineAppointmentsService"
import onlineAppointmentsService from "../../../services/cashbox/onlineAppointmentsService"
import constructorObjectService from "../../../services/constructorObjectService"
import { pageToOffset } from "../../../utils/pageToOffset"

const computedColumns = [
  {
    id: "1",
    label: "Дата",
    slug: "date",
    type: "DATE",
  },
  {
    id: "2",
    label: "ФИО пациента",
    slug: "patient_full_name",
    type: "SINGLE_LINE",
  },
  {
    id: "3",
    label: "Cтатус",
    slug: "payment_status",
    type: "SWITCH",
    attributes: {
      text_true: "Оплачено",
      text_false: "Не оплачено",

    }
  },
  {
    id: "4",
    label: "Стоимость",
    slug: "overall_price",
    type: "NUMBER"
  },
]

const CashboxAppointMentsTable = ({ tableSlug, type }) => {
  const { navigateToForm } = useCashboxTabRouter()

  const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const getAllData = async () => {
    setTableLoader(true)
    try {

      let service
      if(type === "online") service = onlineAppointmentsService
      else service = offlineAppointmentsService

      const data = await service.getList({ offset: pageToOffset(currentPage), limit: 10, ...filters })

      const pageCount = Math.ceil(data.count / 10)

      setTableData(data.offline_appointments ?? data.booked_appointments ?? [])
      setPageCount(isNaN(pageCount) ? 1 : pageCount)
    } finally {
      setTableLoader(false)
    }
  }

  const deleteHandler = async (id) => {
    setTableLoader(true)
    try {
      await constructorObjectService.delete(tableSlug, id)
      getAllData()
    } catch {
      setTableLoader(false)
    }
  }

  const navigateToEditPage = (row) => {
    navigateToForm(row.id, type, row.patient_full_name)
  }

  useDebouncedWatch(
    () => {
      if (currentPage === 1) getAllData()
      setCurrentPage(1)
    },
    [filters],
    500
  )

  useEffect(() => {
    getAllData()
  }, [currentPage])

  return (
    <div className="pt-2">
      <DataTable
        columns={computedColumns}
        data={tableData}
        loader={tableLoader}
        removableHeight={220}
        currentPage={currentPage}
        pagesCount={pageCount}
        onPaginationChange={setCurrentPage}
        onRowClick={navigateToEditPage}
        filters={filters}
        filterChangeHandler={filterChangeHandler}
      />

      {/* <CTable
        removableHeight={250}
        count={pageCount}
        page={currentPage}
        setCurrentPage={setCurrentPage}
      >
        <CTableHead>
          <CTableRow>
            <CTableCell width={10}>№</CTableCell>
            {computedColumns.map((field, index) => (
              <CTableCell key={index}>
                <div className="table-filter-cell">
                  {field.label}
                  <FilterGenerator
                    field={field}
                    name={field.slug}
                    onChange={filterChangeHandler}
                    filters={filters}
                  />
                </div>
              </CTableCell>
            ))}
            <CTableCell></CTableCell>
          </CTableRow>
        </CTableHead>

        <CTableBody
            loader={tableLoader}
            columnsCount={computedColumns.length + 2}
            dataLength={tableData.length}
          >
            {tableData.map((row, rowIndex) => (
              <CTableRow key={row.guid} onClick={() => navigateToEditPage(row)}>
                <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
                {computedColumns.map((field) => (
                  <CTableCell key={field.id} className="text-nowrap">
                    <CellElementGenerator field={field} row={row} />
                  </CTableCell>
                ))}

                <CTableCell buttonsCell>
                  <DeleteWrapperModal id={row.guid} onDelete={deleteHandler}>
                    <RectangleIconButton
                      color="error"
                      // onClick={() => deleteHandler(row.guid)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>


      </CTable> */}
    </div>
  )
}

export default CashboxAppointMentsTable
