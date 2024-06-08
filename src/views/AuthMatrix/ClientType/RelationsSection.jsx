import { Collapse } from "@mui/material";
import { useState } from "react";
import RowLinearLoader from "../../../components/RowLinearLoader";
import CreateRowButton from "../../../components/CreateRowButton";
import { useParams } from "react-router-dom";
import clientRelationService from "../../../services/auth/clientRelationService";
import RelationCreateRow from "./RelationCreateRow";
import RelationsRow from "./RelationsRow";

const RelationsSection = ({ relationsList, setRelationsList, loader }) => {
  const { typeId } = useParams();

  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);

  const createNewRelation = (values) => {
    const data = {
      ...values,
      client_type_id: typeId,
    };

    setCreateLoader(true);
    clientRelationService
      .create(data)
      .then((res) => {
        setCreateFormVisible(false);
        setRelationsList((prev) => [...prev, res]);
      })
      .catch(() => setCreateLoader(false));
  };

  return (
    <>
      <div className="card silver-right-border" style={{ flex: 1 }}>
        <div className="card-header silver-bottom-border">
          <div className="card-title">RELATIONS</div>
          <div className="card-extra">
            <CreateRowButton
              formVisible={createFormVisible}
              setFunction={setCreateFormVisible}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>

        {relationsList?.map((relation, index) => (
          <RelationsRow
            setRelationsList={setRelationsList}
            key={relation.id}
            relation={relation}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default RelationsSection;
