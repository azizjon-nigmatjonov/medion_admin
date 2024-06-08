import { useMutation, useQuery } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import DataTable from "../../../../components/DataTable"
import TableRowButton from "../../../../components/TableRowButton"
import variableService from "../../../../services/analytics/variableService"
import styles from "./style.module.scss"

const columns = [
  {
    id: 1,
    label: "Название",
    slug: "label",
  },
  {
    id: 2,
    label: "Slug",
    slug: "slug",
  },
]

const Variables = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { data, isLoading, refetch } = useQuery(["GET_VARIABLES_LIST"], () => {
    return variableService.getList()
  })

  const { mutate: deleteVariable, isLoading: deleteLoading } = useMutation((row) => {
    return variableService.delete(row.id)
  }, {
    onSuccess: () => refetch()
  })

  const navigateToCreateForm = () => navigate(`${pathname}/create`)
  const navigateToEditForm = (row) => navigate(`${pathname}/${row.id}`)

  return (
    <div className={styles.formCard}>
      <h2 className={styles.title}>Переменные</h2>

      <div className={styles.mainBlock}>
        <DataTable
          removableHeight={"auto"}
          disablePagination
          additionalRow={
            <TableRowButton
              colSpan={columns.length + 2}
              onClick={navigateToCreateForm}
            />
          }
          onRowClick={navigateToEditForm}
          dataLength={1}
          loader={isLoading || deleteLoading}
          data={data?.variables}
          columns={columns}
          onDeleteClick={deleteVariable}
          disableFilters
        />
      </div>
    </div>
  )
}

export default Variables
