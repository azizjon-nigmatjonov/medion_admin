import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";
import { useLocation } from "react-router-dom";

import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../CTable";
import FilterGenerator from "../../views/Objects/components/FilterGenerator";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import { PinIcon, ResizeIcon } from "../../assets/icons/icon";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import TableRow from "./TableRow";
import SummaryRow from "./SummaryRow";
import MultipleUpdateRow from "./MultipleUpdateRow";
import "./style.scss";
import { selectedRowActions } from "../../store/selectedRow/selectedRow.slice";
import CellCheckboxNoSign from "./CellCheckboxNoSign";

const ObjectDataTable = ({
  data = [],
  loader = false,
  removableHeight,
  additionalRow,
  remove,
  fields = [],
  isRelationTable,
  disablePagination,
  currentPage = 1,
  onPaginationChange = () => {},
  pagesCount = 1,
  columns = [],
  watch,
  control,
  setFormValue,
  dataLength,
  onDeleteClick,
  onEditClick,
  onRowClick = () => {},
  filterChangeHandler = () => {},
  filters,
  disableFilters,
  tableStyle,
  wrapperStyle,
  tableSlug,
  isResizeble,
  paginationExtraButton,
  onCheckboxChange,
  limit,
  setLimit,
  isChecked,
  formVisible,
  summaries,
  relationAction,
  onChecked,
  defaultLimit,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const selectedRow = useSelector((state) => state.selectedRow.selected);

  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);

  const popupRef = useRef(null);
  useOnClickOutside(popupRef, () => setColumnId(""));

  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];

  useEffect(() => {
    if (!isResizeble) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll("th");
      [].forEach.call(cols, function (col, idx) {
        // Add a resizer element to the column
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");

        // Set the height
        resizer.style.height = `${table.offsetHeight}px`;

        col.appendChild(resizer);

        createResizableColumn(col, resizer, idx);
      });
    };

    const createResizableColumn = function (col, resizer, idx) {
      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e) {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        resizer.classList.add("resizing");
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const colID = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({ pageName, colID, colWidth }));
        dispatch(
          tableSizeAction.setTableSettings({
            pageName,
            colID,
            colWidth,
            isStiky: "ineffective",
            colIdx: idx - 1,
          })
        );
        col.style.width = `${colWidth}px`;
      };

      const mouseUpHandler = function () {
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      resizer.addEventListener("mousedown", mouseDownHandler);
    };

    createResizableTable(document.getElementById("resizeMe"));
  }, [data]);

  const handleAutoSize = (colID, colIdx) => {
    dispatch(
      tableSizeAction.setTableSize({ pageName, colID, colWidth: "auto" })
    );
    const element = document.getElementById(colID);
    element.style.width = "auto";
    element.style.minWidth = "auto";
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: element.offsetWidth,
        isStiky: "ineffective",
        colIdx,
      })
    );
    setColumnId("");
  };

  const handlePin = (colID, colIdx) => {
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: currentColumnWidth,
        isStiky: true,
        colIdx,
      })
    );
    setColumnId("");
  };

  const calculateWidth = (colId, index) => {
    const colIdx = tableSettings?.[pageName]
      ?.filter((item) => item?.isStiky === true)
      ?.findIndex((item) => item?.id === colId);

    if (index === 0) {
      return 0;
    } else if (colIdx === 0) {
      return 0;
    } else if (
      tableSettings?.[pageName]?.filter((item) => item?.isStiky === true)
        .length === 1
    ) {
      return 0;
    } else {
      return tableSettings?.[pageName]
        ?.filter((item) => item?.isStiky === true)
        ?.slice(0, colIdx)
        ?.reduce((acc, item) => acc + item?.colWidth, 0);
    }
  };

  useEffect(() => {
    if (!formVisible) {
      dispatch(selectedRowActions.clear());
    }
  }, [formVisible]);

  return (
    <CTable
      disablePagination={disablePagination}
      removableHeight={removableHeight}
      count={pagesCount}
      page={currentPage}
      setCurrentPage={onPaginationChange}
      loader={loader}
      tableStyle={tableStyle}
      wrapperStyle={wrapperStyle}
      paginationExtraButton={paginationExtraButton}
      limit={limit}
      setLimit={setLimit}
      defaultLimit={defaultLimit}
    >
      <CTableHead>
        {formVisible && selectedRow.length > 0 && (
          <MultipleUpdateRow
            columns={data}
            fields={columns}
            watch={watch}
            setFormValue={setFormValue}
            control={control}
          />
        )}
        <CTableRow>
          <CellCheckboxNoSign formVisible={formVisible} data={data} />

          {columns.map((column, index) => (
            <CTableHeadCell
              id={column.id}
              key={index}
              style={{
                padding: "10px 4px",
                minWidth: tableSize?.[pageName]?.[column.id]
                  ? tableSize?.[pageName]?.[column.id]
                  : "auto",
                width: tableSize?.[pageName]?.[column.id]
                  ? tableSize?.[pageName]?.[column.id]
                  : "auto",
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
                color: formVisible && column?.required === true ? "red" : "",
              }}
            >
              <div
                className='table-filter-cell cell-data'
                onMouseEnter={(e) => {
                  setCurrentColumnWidth(e.relatedTarget.offsetWidth);
                }}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setColumnId((prev) =>
                      prev === column.id ? "" : column.id
                    );
                  }}
                >
                  {column.label}
                </span>
                {disableFilters && (
                  <FilterGenerator
                    field={column}
                    name={column.slug}
                    onChange={filterChangeHandler}
                    filters={filters}
                    tableSlug={tableSlug}
                  />
                )}
                {columnId === column?.id && (
                  <div className='cell-popup' ref={popupRef}>
                    <div
                      className='cell-popup-item'
                      onClick={() => handlePin(column?.id, index)}
                    >
                      <PinIcon
                        pinned={
                          tableSettings?.[pageName]?.find(
                            (item) => item?.id === column?.id
                          )?.isStiky
                        }
                      />
                      <span>Pin column</span>
                    </div>
                    <div
                      className='cell-popup-item'
                      onClick={() => handleAutoSize(column?.id, index)}
                    >
                      <ResizeIcon />
                      <span>Autosize</span>
                    </div>
                  </div>
                )}
              </div>
            </CTableHeadCell>
          ))}

          <PermissionWrapperV2
            tabelSlug={tableSlug}
            type={["update", "delete"]}
          >
            {(onDeleteClick || onEditClick) && (
              <CTableHeadCell width={10}></CTableHeadCell>
            )}
          </PermissionWrapperV2>
        </CTableRow>
      </CTableHead>
      <CTableBody
        loader={loader}
        columnsCount={columns.length}
        dataLength={dataLength || data?.length}
      >
        {(isRelationTable ? fields : data)?.map((row, rowIndex) => (
          <TableRow
            remove={remove}
            watch={watch}
            control={control}
            key={row.guid ?? row.id}
            row={row}
            formVisible={formVisible}
            rowIndex={rowIndex}
            onRowClick={onRowClick}
            isChecked={isChecked}
            onCheckboxChange={onCheckboxChange}
            currentPage={currentPage}
            limit={limit}
            setFormValue={setFormValue}
            columns={columns}
            tableHeight={tableHeight}
            tableSettings={tableSettings}
            pageName={pageName}
            calculateWidth={calculateWidth}
            tableSlug={tableSlug}
            onDeleteClick={onDeleteClick}
            relationAction={relationAction}
            onChecked={onChecked}
            relationFields={fields}
          />
        ))}
        {!!summaries?.length && (
          <SummaryRow summaries={summaries} columns={columns} data={data} />
        )}
        {additionalRow}
      </CTableBody>
    </CTable>
  );
};

export default ObjectDataTable;
