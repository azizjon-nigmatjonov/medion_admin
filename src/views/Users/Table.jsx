import { Delete } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import ButtonsPopover from "../../components/ButtonsPopover";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import TableRowButton from "../../components/TableRowButton";
import UserInfoBlock from "../../components/UserInfoBlock";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import userService from "../../services/auth/userService";
import { pageToOffset } from "../../utils/pageToOffset";

const UsersTable = ({ searchText }) => {
  const navigate = useNavigate();

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
        search: searchText,
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

  const navigateToEditForm = (id) => {
    navigate(`/settings/auth/users/${id}`);
  };

  useDebouncedWatch(
    () => {
      if (currentPage === 1) fetchTableData();
      else setCurrentPage(1);
    },
    [searchText],
    400
  );

  useEffect(() => {
    fetchTableData();
  }, [currentPage]);

  return (
    <Card className="p-2">
      <CTable
        count={pageCount}
        page={currentPage}
        setCurrentPage={setCurrentPage}
        loader={loader}
        removableHeight={225}
      >
        <CTableHead>
          <CTableHeadRow>
            <CTableCell width={20}>No</CTableCell>
            <CTableCell>FIO</CTableCell>
            <CTableCell>Email</CTableCell>
            <CTableCell>Login</CTableCell>
            <CTableCell width={30}></CTableCell>
          </CTableHeadRow>
        </CTableHead>
        {
          <CTableBody
            loader={loader}
            columnsCount={5}
            dataLength={tableData?.length}
          >
            {tableData?.map((data, index) => (
              <CTableRow
                key={data.id}
                onClick={() => navigateToEditForm(data.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>
                  {" "}
                  <UserInfoBlock
                    img={data.photo_url}
                    title={data.name}
                    subtitle={data.phone}
                  />{" "}
                </CTableCell>
                <CTableCell>{data.email}</CTableCell>
                <CTableCell>{data.login}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteTableData(data.id)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <TableRowButton
              colSpan={5}
              onClick={() => navigate(`/settings/auth/users/create`)}
            />
          </CTableBody>
        }
      </CTable>
    </Card>
  );
};

export default UsersTable;
