import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonsPopover from "../../../../components/ButtonsPopover";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../../components/CTable";
import userService from "../../../../services/auth/userService";
import { pageToOffset } from "../../../../utils/pageToOffset";

const UsersTable = () => {
  const { platformId, typeId } = useParams();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTableData = () => {
    setLoader(true);
    userService
      .getList({
        limit: 10,
        offset: pageToOffset(currentPage),
        "client-platform-id": platformId,
        "client-type-id": typeId,
      })
      .then((res) => {
        setTableData(res.users);
        setPageCount(Math.ceil(res?.count / 10));
      })
      .finally(() => setLoader(false));
  };

  const deleteTableData = (e, id) => {
    setLoader(true);

    userService
      .delete(id)
      .then((res) => {
        fetchTableData();
      })
      .catch(() => setLoader(false));
  };

  const navigateToEditForm = (e, id) => {
    navigate(`${pathname}/user/${id}`);
  };

  useEffect(() => {
    fetchTableData();
  }, [currentPage]);

  return (
    <div className="p-2">
      <CTable
        count={pageCount}
        page={currentPage}
        setCurrentPage={setCurrentPage}
        columnsCount={4}
        loader={loader}
        removableHeight={300}
      >
        <CTableHead>
          <CTableHeadRow>
            <CTableCell width={20}>No</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell width={30}></CTableCell>
          </CTableHeadRow>
        </CTableHead>
        {
          <CTableBody
            loader={loader}
            columnsCount={3}
            dataLength={tableData?.length}
          >
            {tableData?.map((data, index) => (
              <CTableRow
                key={data.id}
                // onClick={() => navigate(`/projects/${data.id}/backlog`)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{data.name}</CTableCell>
                <CTableCell>
                  <ButtonsPopover
                    id={data.id}
                    onEditClick={navigateToEditForm}
                    onDeleteClick={deleteTableData}
                  />
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        }
      </CTable>
    </div>
  );
};

export default UsersTable;
