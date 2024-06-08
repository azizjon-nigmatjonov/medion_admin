import { get } from "@ngard/tiny-get";
import { useMemo } from "react";
import { numberWithSpaces } from "../../utils/formatNumbers";
import { CTableCell, CTableRow } from "../CTable";


const SummaryRow = ({summaries, columns, data}) => {
  const computedSummaries = useMemo(() => {
    return columns?.map(column => {
      const summary = summaries?.find(el => el.field_name === column.id)

      if(!summary) return null
      
      const value = sum(data, column.slug)

      return value
    })
  }, [ columns, data, summaries ])


  return ( <CTableRow className="amountRow" >
    <CTableCell>Итог</CTableCell>

    {
      computedSummaries?.map(column => {
        if(!column) return <CTableCell />
        else return <CTableCell className="text-nowrap" >{ numberWithSpaces(column) }</CTableCell>
      })
    }

  </CTableRow> );
}
 

const sum = (data, slug) => {
  let value = 0

  data?.forEach(row => {
    value += get(row, slug, 0)
  })

  return value
}



export default SummaryRow;