import { Checkbox } from "@mui/material"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import DataTable from "../../../../../components/DataTable"
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox"
import constructorObjectService from "../../../../../services/constructorObjectService"

const LayoutRelationTable = ({ mainForm, index }) => {
  const relations = useWatch({
    control: mainForm.control,
    name: "view_relations",
  })

  const relation = relations[index]

  const { slug } = useParams()

  const relatedTableSlug = useMemo(() => {
    const computedRelation = relation?.relation

    return computedRelation?.table_from === slug
      ? computedRelation?.table_to
      : computedRelation?.table_from
  }, [relation, slug])

  const { data: columns, isLoading: dataFetchingLoading } = useQuery(
    ["GET_VIEW_RELATION_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return null
      return constructorObjectService.getList(relatedTableSlug, {
        data: { limit: 0, offset: 0 },
      })
    },
    {
      select: (res) => {
        return res?.data?.fields ?? []
      },
    }
  )

  return (
    <div>
      {relation && (
        <>
          <Checkbox
            checked={!!relation.is_editable}
            onChange={(_, val) =>
              mainForm.setValue(`view_relations[${index}].is_editable`, val)
            }
          />
          Editable
        </>
      )}

      <DataTable
        removableHeight={false}
        loader={dataFetchingLoading}
        data={[]}
        columns={columns}
        pagesCount={1}
        currentPage={1}
        // onRowClick={navigateToEditPage}
        // onDeleteClick={deleteHandler}
        disableFilters
        // onPaginationChange={setCurrentPage}
      />
    </div>
  )
}

export default LayoutRelationTable
