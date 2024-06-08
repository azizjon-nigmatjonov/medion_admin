import { Checkbox } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { CTableCell, CTableRow } from "../CTable";
import CellElementGenerator from "../ElementGenerators/CellElementGenerator";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import TableRowForm from "./TableRowForm";
import RectangleIconButton from "../Buttons/RectangleIconButton";

const TableRow = ({
  row,
  key,
  rowIndex,
  control,
  onRowClick,
  onDeleteClick,
  checkboxValue,
  onCheckboxChange,
  currentPage,
  columns,
  tableHeight,
  tableSettings,
  pageName,
  calculateWidth,
  watch,
  setFormValue,
  tableSlug,
  isChecked = () => {},
  formVisible,
  remove,
  limit = 10,
  relationAction,
  onChecked,
  relationFields,
}) => {
  if (formVisible)
    return (
      <TableRowForm
        onDeleteClick={onDeleteClick}
        remove={remove}
        watch={watch}
        onCheckboxChange={onCheckboxChange}
        checkboxValue={checkboxValue}
        row={row}
        key={key}
        formVisible={formVisible}
        currentPage={currentPage}
        limit={limit}
        control={control}
        setFormValue={setFormValue}
        rowIndex={rowIndex}
        columns={columns}
        tableHeight={tableHeight}
        tableSettings={tableSettings}
        pageName={pageName}
        calculateWidth={calculateWidth}
        tableSlug={tableSlug}
        relationFields={relationFields}
      />
    );

  return (
    <>
      {relationAction === undefined ? (
        <CTableRow
          onClick={() => {
            onRowClick(row, rowIndex);
          }}
        >
          <CTableCell align='center' className='data_table__number_cell'>
            <span className='data_table__row_number'>
              {(currentPage - 1) * limit + rowIndex + 1}
            </span>
            {onCheckboxChange && (
              <div
                className={`data_table__row_checkbox ${
                  isChecked(row) ? "checked" : ""
                }`}
              >
                <Checkbox
                  checked={isChecked(row)}
                  onChange={(_, val) => onCheckboxChange(val, row)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={index}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "sticky"
                  : "relative",
                left: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? calculateWidth(column?.id, index)
                  : "0",
                backgroundColor: "#fff",
                zIndex: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "1"
                  : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
            </CTableCell>
          ))}
          <CTableCell>
            <PermissionWrapperV2 tabelSlug={tableSlug} type='delete'>
              <RectangleIconButton
                color='error'
                onClick={() =>
                  row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
                }
              >
                <Delete color='error' />
              </RectangleIconButton>
            </PermissionWrapperV2>
          </CTableCell>
        </CTableRow>
      ) : relationAction?.action_relations?.[0]?.value === "go_to_page" ||
        !relationAction?.action_relations ? (
        <CTableRow
          onClick={() => {
            onRowClick(row, rowIndex);
          }}
        >
          <CTableCell align='center' className='data_table__number_cell'>
            <span className='data_table__row_number'>
              {(currentPage - 1) * limit + rowIndex + 1}
            </span>
            {onCheckboxChange && (
              <div
                className={`data_table__row_checkbox ${
                  isChecked(row) ? "checked" : ""
                }`}
              >
                <Checkbox
                  checked={isChecked(row)}
                  onChange={(_, val) => onCheckboxChange(val, row)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={index}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "sticky"
                  : "relative",
                left: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? calculateWidth(column?.id, index)
                  : "0",
                backgroundColor: "#fff",
                zIndex: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "1"
                  : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
            </CTableCell>
          ))}
          <CTableCell>
            <PermissionWrapperV2 tabelSlug={tableSlug} type='delete'>
              <RectangleIconButton
                color='error'
                onClick={() =>
                  row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
                }
              >
                <Delete color='error' />
              </RectangleIconButton>
            </PermissionWrapperV2>
          </CTableCell>
        </CTableRow>
      ) : (
        <CTableRow
          onClick={() => {
            onChecked(row?.guid);
          }}
        >
          <CTableCell align='center' className='data_table__number_cell'>
            <span className='data_table__row_number'>
              {(currentPage - 1) * limit + rowIndex + 1}
            </span>
            {onCheckboxChange && (
              <div
                className={`data_table__row_checkbox ${
                  isChecked(row) ? "checked" : ""
                }`}
              >
                <Checkbox
                  checked={isChecked(row)}
                  onChange={(_, val) => onCheckboxChange(val, row)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </CTableCell>

          {columns.map((column, index) => (
            <CTableCell
              key={index}
              className={`overflow-ellipsis ${tableHeight}`}
              style={{
                minWidth: "max-content",
                padding: "0 4px",
                position: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "sticky"
                  : "relative",
                left: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? calculateWidth(column?.id, index)
                  : "0",
                backgroundColor: "#fff",
                zIndex: tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky
                  ? "1"
                  : "",
              }}
            >
              <CellElementGenerator field={column} row={row} />
            </CTableCell>
          ))}
          <PermissionWrapperV2 tableSlug={tableSlug} type='delete'>
            <RectangleIconButton
              color='error'
              onClick={() =>
                row.guid ? onDeleteClick(row, rowIndex) : remove(rowIndex)
              }
            >
              <Delete color='error' />
            </RectangleIconButton>
          </PermissionWrapperV2>
        </CTableRow>
      )}
    </>
  );
};

export default TableRow;
