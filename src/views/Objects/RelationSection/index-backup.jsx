import { Add } from "@mui/icons-material"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

import SecondaryButton from "../../../components/Buttons/SecondaryButton"

import DataTable from "../../../components/DataTable"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import FormCard from "../components/FormCard"
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal"
import RelationCreateModal from "./RelationCreateModal"

const RelationSection = ({ relation }) => {
  const { tableSlug, id } = useParams()
  const { navigateToForm } = useTabRouter()

  // const [tableLoader, setTableLoader] = useState(true)
  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [columns, setColumns] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const queryClient = useQueryClient()
  
  const { isLoading: dataFetchingLoading, refetch } = useQuery(["GET_OBJECT_LIST", relation.relatedTable?.slug, tableSlug, relation.type, currentPage, id], () => {
    return constructorObjectService.getList(
      relation.relatedTable?.slug,
      {
        data: {
          offset: pageToOffset(currentPage, 5),
          limit: 5,
          [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]:
            id,
        },
      }
    )
  }, {
    onSuccess: ({data}) => {
      if (id) {
        setTableData(objectToArray(data.response ?? {}))
        setPageCount(isNaN(data.count) ? 1 : Math.ceil(data.count / 5))
      }

      setColumns(data.fields ?? [])
    }
  })

  const { isLoading: deleteLoading, mutate: deleteHandler } = useMutation("DELETE_OBJECT", (elementId) => {
    if (relation.type === "Many2Many") {
      const data = {
        id_from: id,
        id_to: [elementId],
        table_from: tableSlug,
        table_to: relation.relatedTable?.slug,
      }

      return constructorObjectService.deleteManyToMany(data)
  }

  else {
    return constructorObjectService.delete(
      relation.relatedTable?.slug,
      elementId
    )
  }

}, {
  onSettled: () => {
    queryClient.refetchQueries(["GET_OBJECT_LIST", relation.relatedTable?.slug])
  }
})

  const tableLoader = deleteLoading || dataFetchingLoading

 
  const navigateToEditPage = (row) => {
    navigateToForm(relation.relatedTable?.slug, "EDIT", row)
    // navigate(`/object/${relation.relatedTable?.slug}/${id}`)
  }

  const navigateToCreatePage = () => {
    if(relation.type === "Many2Many") setModalVisible(true)
    else navigateToForm(relation.relatedTable?.slug, "CREATE", null, { [`${tableSlug}_id`]: id })
  }

  return (
    <>
      {modalVisible && relation.type !== "Many2Many" && (
        <RelationCreateModal
          table={relation.relatedTable}
          closeModal={() => setModalVisible(false)}
        />
      )}
      {modalVisible && relation.type === "Many2Many" && (
        <ManyToManyRelationCreateModal
          table={relation.relatedTable}
          closeModal={() => setModalVisible(false)}
          onCreate={refetch}
        />
      )}
      <FormCard
        icon={relation.relatedTable?.icon}
        title={relation.relatedTable?.label}
        maxWidth="100%"
        extra={
          <SecondaryButton disabled={!id} onClick={navigateToCreatePage} > <Add /> Добавить</SecondaryButton>
        }
      >

        <DataTable 
          removableHeight={false}
          loader={tableLoader}
          data={tableData}
          columns={columns}
          pagesCount={pageCount}
          currentPage={currentPage}
          onRowClick={navigateToEditPage}
          onDeleteClick={deleteHandler}
          disableFilters
          tableSlug={tableSlug}
          onPaginationChange={setCurrentPage}
        />
      </FormCard>
    </>
  )
}

export default RelationSection
