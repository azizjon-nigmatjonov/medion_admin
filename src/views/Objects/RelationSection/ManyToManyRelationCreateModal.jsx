import { Checkbox } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import CreateButton from "../../../components/Buttons/CreateButton";
import DataTable from "../../../components/DataTable";
import LargeModalCard from "../../../components/LargeModalCard";
import SearchInput from "../../../components/SearchInput";
import useDebounce from "../../../hooks/useDebounce";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import { generateID } from "../../../utils/generateID";
import { objectToArray } from "../../../utils/objectToArray";
import { pageToOffset } from "../../../utils/pageToOffset";

const ManyToManyRelationCreateModal = ({ relation, closeModal }) => {
  const { tableSlug, id } = useParams();
  const { navigateToForm } = useTabRouter();
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(10);

  const relatedTableSlug = relation.relatedTable;
  const [btnLoader, setBtnLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedElements, setCheckedElements] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});

  const getSearchViewFields = useMemo(() => {
    return relation?.view_fields?.map((item) => item?.slug);
  }, [relation]);

  const {
    isLoading: loader,
    data: { tableData, pageCount, fields } = {
      tableData: [],
      pageCount: 1,
      fields: [],
    },
  } = useQuery(
    [
      "GET_OBJECT_LIST",
      {
        tableSlug: relatedTableSlug,
        limit: limit,
        offset: pageToOffset(currentPage, limit),
        filters,
        searchText,
      },
    ],
    () => {
      return constructorObjectService.getList(relatedTableSlug, {
        data: {
          offset: pageToOffset(currentPage, limit),
          limit: limit,
          view_fields: getSearchViewFields,
          search: searchText,
          ...filters,
        },
      });
    },
    {
      select: ({ data }) => {
        const pageCount = Math.ceil(data?.count / 10);

        return {
          fields: data?.fields ?? [],
          tableData: objectToArray(data?.response ?? {}),
          pageCount: isNaN(pageCount) ? 1 : pageCount,
        };
      },
    }
  );

  const computedFields = useMemo(() => {
    const staticFields = [
      {
        id: generateID(),
        render: (row) => (
          <Checkbox
            onChange={(e) => onCheck(e, row.guid)}
            checked={checkedElements.includes(row.guid)}
          />
        ),
      },
    ];

    return [...staticFields, ...fields];
  }, [fields, checkedElements]);
  
  const onCheck = (e, id) => {
    if (e.target.checked) {
      setCheckedElements([...checkedElements, id]);
    } else {
      setCheckedElements(checkedElements.filter((element) => element !== id));
    }
  };

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    try {
      setBtnLoader(true);

      const data = {
        id_from: id,
        id_to: checkedElements,
        table_from: tableSlug,
        table_to: relatedTableSlug,
      };

      await constructorObjectService.updateManyToMany(data);

      queryClient.invalidateQueries(["GET_OBJECT_LIST", relatedTableSlug]);
      closeModal();
    } catch (error) {
      setBtnLoader(false);
    }
  };
  const inputChangeHandler = useDebounce((val) => setSearchText(val), 300);

  useEffect(() => {
    if (isNaN(parseInt(relation?.default_limit))) setLimit(10);
    else setLimit(parseInt(relation?.default_limit));
  }, [relation?.default_limit]);
  
  const filteredColumns = useMemo(() => {
    return computedFields.filter(item => relation?.columns?.includes(item?.id) || item?.render)
  }, [computedFields, relation?.columns])
  
  return (
    <LargeModalCard
      title={relation.label}
      // loader={loader}
      btnLoader={btnLoader}
      oneColumn
      onSaveButtonClick={onSubmit}
      onClose={closeModal}
    >
      <div className="flex align-center gap-2 mb-2">
        <SearchInput
          style={{ flex: 1 }}
          autoFocus
          onChange={(e) => inputChangeHandler(e)}
        />
        <CreateButton
          title="Создать новый"
          onClick={() => {
            navigateToForm(relation.relatedTable, "CREATE", null, {});
            closeModal();
          }}
        />
      </div>

      <DataTable
        removableHeight={320}
        columns={computedFields}
        data={tableData}
        loader={loader}
        currentPage={currentPage}
        onPaginationChange={setCurrentPage}
        pagesCount={pageCount}
        tableSlug={relation.relatedTable}
        filterChangeHandler={filterChangeHandler}
        filters={filters}
        limit={limit}
        setLimit={setLimit}
        filteredColumns={filteredColumns}
        defaultLimit={relation?.default_limit}
      />

      {/* <CTable
        removableHeight={false}
        count={pageCount}
        page={currentPage}
        setCurrentPage={setCurrentPage}
      >
        <CTableHead>
          <CTableCell width={70}></CTableCell>
          <CTableCell width={10}>№</CTableCell>
          {fields.map((field, index) => (
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
        </CTableHead>

        <CTableBody
          loader={loader}
          columnsCount={fields.length + 2}
          dataLength={tableData.length}
        >
          {tableData.map((row, rowIndex) => (
            <CTableRow
              key={row.guid}
              // onClick={() => navigateToEditPage(row.guid)}
            >
              <CTableCell style={{ padding: "0 16px" }}>
                <Checkbox
                  onChange={(e) => onCheck(e, row.guid)}
                  checked={checkedElements.includes(row.guid)}
                />
              </CTableCell>
              <CTableCell>{(currentPage - 1) * 10 + rowIndex + 1}</CTableCell>
              {fields.map((field) => (
                <CTableCell key={field.id} className="text-nowrap">
                  <CellElementGenerator row={row} field={field} />
                </CTableCell>
              ))}

              <CTableCell>
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
    </LargeModalCard>
  );
};

export default ManyToManyRelationCreateModal;
