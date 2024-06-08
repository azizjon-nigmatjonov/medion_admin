import Table from "./Table";
import FiltersBlock from "../../components/FiltersBlock";
import { useState } from "react";
import SearchInput from "../../components/SearchInput";
import HeaderSettings from "../../components/HeaderSettings";

const UsersPage = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="UsersPage">
      <HeaderSettings title="Пользователи" />
      <FiltersBlock>
        <SearchInput value={searchText} onChange={setSearchText} />
      </FiltersBlock>
      <div className="p-2">
        <Table searchText={searchText} />
      </div>
    </div>
  );
};

export default UsersPage;
