import { Delete } from "@mui/icons-material"
import { useWatch } from "react-hook-form"
import { useQuery } from "react-query"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import constructorFieldService from "../../../../../services/constructorFieldService"
import listToOptions from "../../../../../utils/listToOptions"

const DynamicRelationRow = ({ control, index, deleteTable, computedTablesList }) => {
  
  const selectedTableSlug = useWatch({
    control,
    name: `dynamic_tables[${index}].table_slug`
  })

  const { data: fields } = useQuery(["GET_TABLE_FIELDS", selectedTableSlug], () => {
    if (!selectedTableSlug) return []
    return constructorFieldService.getList({ table_slug: selectedTableSlug })
  }, {
    select: ({ fields }) => listToOptions(fields?.filter(field => field.type !== 'LOOKUP'), "label", "id")
  })
  
  return (
    <div className="flex align-center gap-2 mb-2">
      <HFSelect
        options={computedTablesList}
        placeholder="Table"
        control={control}
        fullWidth
        name={`dynamic_tables[${index}].table_slug`}
      />
      <HFMultipleSelect
        control={control}
        fullWidth
        placeholder="View fields"
        name={`dynamic_tables[${index}].view_fields`}
        options={fields}
      />
      <RectangleIconButton color="error" onClick={() => deleteTable(index)}>
        <Delete color="error" />
      </RectangleIconButton>
    </div>
  )
}

export default DynamicRelationRow
