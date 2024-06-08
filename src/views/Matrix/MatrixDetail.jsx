import CustomTabs from "../../components/CustomTabs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormCard from "../../components/FormCard";
import styles from "./styles.module.scss";
import HFTextField from "../../components/FormElements/HFTextField";
import { useForm } from "react-hook-form";
import FRow from "../../components/FormElements/FRow";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import constructorTableService from "../../services/constructorTableService";
import constructorFieldService from "../../services/constructorFieldService";
import Logins from "./Logins";
import Connections from "./Connections";
import MatrixRoles from "./MatrixRoles";
import HeaderSettings from "../../components/HeaderSettings";
import constructorRelationService from "../../services/constructorRelationService";
const MatrixDetail = () => {
  const [tabIndex, setTabIndex] = useState(1);
  const tabs = [
    {
      id: 1,
      name: "Инфо",
    },
    {
      id: 2,
      name: "Роли",
    },
  ];
  const params = useParams();
  const [clientType, setClientType] = useState({});
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [relations, setRelations] = useState([]);
  const [tableIdGet, setTableIdGet] = useState("");

  const getTables = () => {
    constructorTableService.getList().then((res) => {
      setTables(res?.tables || []);
    });
  };

  const getFields = (params) => {
    constructorFieldService.getList(params).then((res) => {
      setFields(res?.fields || []);
    });
  };

  const getRelations = (prmt) => {
    constructorRelationService.getList(prmt).then((res) => {
      handleFilterRelations(res?.relations, prmt.table_id);
    });
  };

  function handleFilterRelations(list, tableId) {
    if (!list) return;
    const array = [];
    let from = "";
    list.forEach((element) => {
      if (element.table_from.id === tableId) from = "to";
      else if (element.table_to.id === tableId) from = "from";
      element[`table_${from}`].field_slug = element[`field_${from}`];
      element[`table_${from}`].type = element.type;
      array.push(element[`table_${from}`]);
      if (from === "to") setTableIdGet(element?.table_from?.slug);
      if (from === "from") setTableIdGet(element?.table_to?.slug);
    });
    setRelations(array ?? []);
  }

  const getClientType = () => {
    clientTypeServiceV2.getById(params.typeId).then((res) => {
      setClientType(res?.data?.response);
      const platform = res?.data?.response?.$client_platform?.find((item) => item?.guid === params.platformId);
      infoForm.setValue("name", platform?.name);
      infoForm.setValue("subdomain", platform?.subdomain);
      infoForm.setValue("userType", res?.data?.response?.name);
      infoForm.setValue("clientTypeId", res?.data?.response?.guid);
    });
  };

  const computedTableOptions = tables.map((item) => ({
    ...item,
    value: item.id,
  }));

  const computedFieldOptions = fields.map((item) => ({
    ...item,
    value: item.slug,
  }));

  const cumputedRelationOptions = relations?.map((item) => ({
    ...item,
    value: item.id,
  }));

  const infoForm = useForm({
    defaultValues: {
      name: "",
      subdomain: "",
      userType: "",
      clientTypeId: "",
    },
  });

  useEffect(() => {
    getClientType();
    getTables();
  }, []);

  return (
    <div>
      <HeaderSettings title="Matrix">
        <CustomTabs tabIndex={tabIndex} setTabIndex={setTabIndex} tabs={tabs} />
      </HeaderSettings>

      {tabIndex === 1 ? (
        <div className={styles?.detail_holder}>
          <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
            <div className={styles.info_card}>
              <FRow label="Domain">
                <HFTextField name="subdomain" control={infoForm.control} fullWidth />
              </FRow>
              <FRow label="Название">
                <HFTextField name="name" control={infoForm.control} fullWidth />
              </FRow>
              <FRow label="User type">
                <HFTextField name="userType" control={infoForm.control} fullWidth />
              </FRow>
            </div>
          </FormCard>

          <Logins clientType={clientType} tables={computedTableOptions} fields={computedFieldOptions} getFields={getFields} />

          <Connections
            clientType={clientType}
            tables={computedTableOptions}
            fields={computedFieldOptions}
            getFields={getFields}
            relations={cumputedRelationOptions}
            getRelations={getRelations}
            tableIdGet={tableIdGet}
          />
        </div>
      ) : (
        <div style={{ margin: "8px" }}>
          <MatrixRoles infoForm={infoForm} />
        </div>
      )}
    </div>
  );
};

export default MatrixDetail;
