import { useEffect, useState } from "react";
import {
  CheckIcon,
  CrossIcon,
  EditIcon,
  PlusIcon,
} from "../../assets/icons/icon";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import PlatformModal from "../AuthMatrix/PlatformModal";
import ClientTypeModal from "../AuthMatrix/ClientTypeModal";
import clientPlatformServiceV2 from "../../services/auth/clientPlatformServiceV2";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

const MatrixTable = () => {
  const [clientTypes, setClientTypes] = useState([]);
  const [clientPlatforms, setClientPlatforms] = useState([]);
  const [platformId, setPlatformId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalLoader, setModalLoading] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const navigate = useNavigate();

  const closeModal = () => {
    setSelectedObject(null);
    setModalType(null);
  };

  const createPlatform = (data) => {
    setModalLoading(true);

    clientPlatformServiceV2
      .create(data)
      .then((res) => {
        setClientPlatforms((prev) => [...prev, res]);
        closeModal();
      })
      .finally(() => setModalLoading(false));
  };

  const updatePlatform = (data) => {
    setModalLoading(true);

    clientPlatformServiceV2
      .update(data)
      .then((res) => {
        setClientPlatforms((prev) =>
          prev.map((platform) => (platform.id !== data.id ? platform : data))
        );
        closeModal();
      })
      .finally(() => setModalLoading(false));
  };

  const createType = (data) => {
    setModalLoading(true);

    clientTypeServiceV2
      .create(data)
      .then((res) => {
        setClientTypes((prev) => [...prev, res]);
        closeModal();
      })
      .finally(() => setModalLoading(false));
  };

  const updateType = (data) => {
    setModalLoading(true);

    clientTypeServiceV2
      .update(data)
      .then((res) => {
        setClientTypes((prev) =>
          prev.map((type) => (type.id !== data.id ? type : data))
        );
        closeModal();
      })
      .finally(() => setModalLoading(false));
  };

  const getClientTypes = () => {
    clientTypeServiceV2
      .getList()
      .then((res) => {
        setClientTypes(res?.data?.response);
      })
      .catch((err) => {});
  };

  const getClientPlatforms = () => {
    clientPlatformServiceV2
      .getList()
      .then((res) => {
        setClientPlatforms(res?.data?.response);
      })
      .catch((err) => {});
  };

  const openPlatformCreateModal = () => {
    setModalType("platformCreate");
  };

  const openTypeCreateModal = () => {
    setModalType("typeCreate");
  };

  useEffect(() => {
    getClientTypes();
    getClientPlatforms();
  }, []);

  return (
    <div>
      <CTable disablePagination={true}>
        <CTableHead>
          <CTableHeadRow>
            <CTableCell>Matrix</CTableCell>
            {clientPlatforms.map((clientPlatform) => (
              <CTableCell>
                <div>
                  <div>{clientPlatform?.name}</div>
                  <div>{clientPlatform?.subdomain}</div>
                </div>
              </CTableCell>
            ))}
            <CTableCell
              align="center"
              onClick={openPlatformCreateModal}
              style={{ cursor: "pointer" }}
            >
              <PlusIcon />
            </CTableCell>
          </CTableHeadRow>
        </CTableHead>
        <CTableBody loader={false} columnsCount={3} dataLength={10}>
          {clientTypes?.map((clientType, index) => (
            <CTableRow>
              <CTableCell>{clientType?.name}</CTableCell>
              {clientPlatforms.map((clientPlatform, index) => (
                <CTableCell
                  onMouseEnter={() =>
                    setPlatformId(clientPlatform?.guid + clientType?.guid)
                  }
                  onMouseLeave={() => setPlatformId(null)}
                >
                  {clientPlatform?.client_type_ids?.includes(
                    clientType?.guid
                  ) ? (
                    <div className={styles.table_btn}>
                      <div className={styles.table_btn_icon}>
                        <CheckIcon />
                      </div>
                      {/* Edit on Hover */}
                      {platformId ===
                      clientPlatform?.guid + clientType?.guid ? (
                        <div
                          className={styles.table_btn_icon}
                          onClick={() =>
                            navigate(
                              `${clientType?.guid}/${clientPlatform?.guid}`
                            )
                          }
                        >
                          <EditIcon />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className={styles.table_btn}>
                      <div className={styles.table_btn_icon}>
                        <CrossIcon />
                      </div>
                      {/* Edit on Hover */}
                      {platformId ===
                      clientPlatform?.guid + clientType?.guid ? (
                        <div
                          className={styles.table_btn_icon}
                          onClick={() =>
                            navigate(
                              `${clientType?.guid}/${clientPlatform?.guid}`
                            )
                          }
                        >
                          <EditIcon />
                        </div>
                      ) : null}
                    </div>
                  )}
                </CTableCell>
              ))}
            </CTableRow>
          ))}
          <CTableRow>
            <CTableCell align="center" onClick={openTypeCreateModal}>
              <PlusIcon />
            </CTableCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      {(modalType === "platformCreate" || modalType === "platformEdit") && (
        <PlatformModal
          updatePlatform={updatePlatform}
          selectedPlatform={selectedObject}
          loading={modalLoader}
          createPlatform={createPlatform}
          modalType={modalType}
          closeModal={closeModal}
        />
      )}

      {(modalType === "typeCreate" || modalType === "typeEdit") && (
        <ClientTypeModal
          updateType={updateType}
          selectedType={selectedObject}
          loading={modalLoader}
          createType={createType}
          modalType={modalType}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default MatrixTable;
