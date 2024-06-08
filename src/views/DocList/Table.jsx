import { Checkbox } from "@mui/material"
import RectangleIconButton from "../../components/Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const tableData = [
  {
    id: 1,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 2,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 3,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 4,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 5,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 6,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 7,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 8,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 9,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
  {
    id: 10,
    docType: 'Счет-фактура',
    docNumber: '1221 от 20.12.2022',
    counteragent: 'ЧП LA VITA BOTTLERS',
    contractNumber: 'Договор №2 20.12.2022',
    price: '150 000 000 сум',
    ndsSumm: '150 000 000 сум'
  },
]

const DocsTable = () => {
  return (
    <CTable
      count={2}
      page={1}
      // setCurrentPage={setCurrentPage}
      loader={false}
      removableHeight={285}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={10}>
            <Checkbox />
          </CTableCell>
          <CTableCell width={10}>№</CTableCell>
          <CTableCell>Тип документа</CTableCell>
          <CTableCell>Номер и дата документа</CTableCell>
          <CTableCell>Контрагент</CTableCell>
          <CTableCell>Номер и дата договора</CTableCell>
          <CTableCell>Стоимость поставки</CTableCell>
          <CTableCell>Стоимость поставки с НДС</CTableCell>
          <CTableCell width={30}></CTableCell>
        </CTableHeadRow>
       
      </CTableHead>
      <CTableBody
          // loader={loader}
          columnsCount={5}
          dataLength={10}
        >
           {tableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              // onClick={() => navigate(`/projects/${data.id}/backlog`)}
            >
              <CTableCell><Checkbox /></CTableCell>
              <CTableCell>{index + 1}</CTableCell>
              
              <CTableCell>{data.docType}</CTableCell>
              <CTableCell>{data.docNumber}</CTableCell>
              <CTableCell>{data.counteragent}</CTableCell>
              <CTableCell>{data.contractNumber}</CTableCell>
              <CTableCell>{data.price}</CTableCell>
              <CTableCell>{data.ndsSumm}</CTableCell>
              <CTableCell>
                <RectangleIconButton color='primary' >
                  <MoreHorizIcon color="primary" />
                </RectangleIconButton>
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
    </CTable>
  )
}

export default DocsTable
