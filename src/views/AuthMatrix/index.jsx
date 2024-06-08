import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../../components/Header"
import clientPlatformService from "../../services/auth/clientPlatformService"
import clientTypeService from "../../services/auth/clientTypeService"
import "./style.scss"
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import clientService from "../../services/auth/clientService"
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import PlatformModal from "./PlatformModal"
import ClientTypeModal from "./ClientTypeModal"
import ButtonsPopover from "../../components/ButtonsPopover"
import ClientBlock from "./ClientBlock"
import { LOGIN_STRATEGIES } from "../../utils/constants/authMatrix"

const AuthMatrix = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [clientPlatformList, setClientPlatformList] = useState([])
  const [clientTypeList, setClientTypeList] = useState([])
  const [clientsList, setClientsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalType, setModalType] = useState(null)
  const [modalLoader, setModalLoading] = useState(false)
  const [selectedObject, setSelectedObject] = useState(null)

  const getMatrix = () => {
    setLoading(true)
    clientService
      .getMatrix(projectId)
      .then((res) => {
        setClientTypeList(res?.client_types ?? [])
        setClientPlatformList(res?.client_platforms ?? [])
        setClientsList(res?.clients ?? [])
      })
      .finally(() => setLoading(false))
  }

  const comutedClientsList = useMemo(() => {
    return clientsList.map((client) => {
      const platformIndex = clientPlatformList.findIndex(
        (el) => el.id === client.client_platform_id
      )
      const typeIndex = clientTypeList.findIndex(
        (el) => el.id === client.client_type_id
      )

      return {
        ...client,
        column: platformIndex + 2,
        row: typeIndex + 2,
      }
    })
  }, [clientPlatformList, clientTypeList, clientsList])

  const emptyBlock = useMemo(() => {
    // const count =
    //   (clientPlatformList.length + 1) * (clientTypeList.length + 1) +
    //   1 -
    //   clientsList.length
    // new Array(count).fill(0)

    const result = []

    clientPlatformList.forEach((platform, platformIndex) => {
      clientTypeList.forEach((type, typeIndex) => {
        result.push({
          platformIndex,
          typeIndex,
        })
      })
    })

    return result
  }, [clientPlatformList, clientTypeList])

  const closeModal = () => {
    setSelectedObject(null)
    setModalType(null)
  }

  const openPlatformCreateModal = () => {
    setModalType("platformCreate")
  }

  const openPlatformEditModal = (e, id) => {
    setSelectedObject(clientPlatformList.find((el) => el.id === id))
    setModalType("platformEdit")
  }

  const openTypeCreateModal = () => {
    setModalType("typeCreate")
  }

  const openTypeEditModal = (e, id) => {
    setSelectedObject(clientTypeList.find((el) => el.id === id))
    setModalType("typeEdit")
  }

  const createPlatform = (data) => {
    setModalLoading(true)

    clientPlatformService
      .create(data)
      .then((res) => {
        setClientPlatformList((prev) => [...prev, res])
        closeModal()
      })
      .finally(() => setModalLoading(false))
  }

  const createType = (data) => {
    setModalLoading(true)

    clientTypeService
      .create(data)
      .then((res) => {
        setClientTypeList((prev) => [...prev, res])
        closeModal()
      })
      .finally(() => setModalLoading(false))
  }

  const updatePlatform = (data) => {
    setModalLoading(true)

    clientPlatformService
      .update(data)
      .then((res) => {
        setClientPlatformList((prev) =>
          prev.map((platform) => (platform.id !== data.id ? platform : data))
        )
        closeModal()
      })
      .finally(() => setModalLoading(false))
  }

  const updateType = (data) => {
    setModalLoading(true)

    clientTypeService
      .update(data)
      .then((res) => {
        setClientTypeList((prev) =>
          prev.map((type) => (type.id !== data.id ? type : data))
        )
        closeModal()
      })
      .finally(() => setModalLoading(false))
  }

  const deletePlatform = (e, id) => {
    clientPlatformService.delete(id).then((res) => {
      setClientPlatformList((prev) =>
        prev.filter((platform) => platform.id !== id)
      )
    })
  }

  const deleteType = (e, id) => {
    clientTypeService.delete(id).then((res) => {
      setClientTypeList((prev) => prev.filter((type) => type.id !== id))
    })
  }

  const updateClient = (client) => {
    setClientsList((prev) =>
      prev.map((el) => {
        if (
          el.client_platform_id !== client.client_platform_id ||
          el.client_type_id !== client.client_type_id
        )
          return el
        return client
      })
    )
  }

  const removeClient = (data) => {
    // clientService.delete(data).then((res) =>
    setClientsList((prev) =>
      prev.filter((el) => {
        if (
          el.client_platform_id === data.client_platform_id &&
          el.client_type_id === data.client_type_id
        )
          return false
        return true
      })
    )
    // )
  }

  const addClient = ({ typeIndex, platformIndex }) => {
    const data = {
      client_platform_id: clientPlatformList[platformIndex].id,
      client_type_id: clientTypeList[typeIndex].id,
      login_strategy: 1,
    }

    clientService
      .create(data)
      .then((res) => setClientsList((prev) => [...prev, data]))
  }

  const computedRelationTypes = useMemo(() => {
    return LOGIN_STRATEGIES.map((type, index) => ({
      label: type,
      value: index,
    }))
  }, [])

  useEffect(() => {
    getMatrix()
  }, [])

  return (
    <>
      <div className="AuthMatrix">
        <Header title="Auth matrix" />

        <div className="p-2" >
          <div className="main-area">
            {loading ? (
              <RingLoaderWithWrapper />
            ) : (
              <div
                className="matrix"
                style={{
                  gridTemplateColumns: `repeat(${
                    clientPlatformList?.length + 2
                  } , auto)`,
                  gridTemplateRows: `repeat(${
                    clientTypeList?.length + 2
                  }, auto)`,
                }}
              >
                {/* --------PlATFORMS LIST------------- */}

                {clientPlatformList?.map((platform, index) => (
                  <div
                    key={platform.id}
                    className="block platform-block"
                    style={{ gridColumnStart: index + 2 }}
                    onClick={() =>
                      navigate(
                        `/settings/auth/matrix/${projectId}/platform/${platform.id}`
                      )
                    }
                  >
                    <div className="info">
                      <div className="title">{platform.name}</div>
                      <div className="subtitle">{platform.subdomain}</div>
                    </div>
                    <ButtonsPopover
                      id={platform.id}
                      onDeleteClick={deletePlatform}
                      onEditClick={openPlatformEditModal}
                    />
                  </div>
                ))}

                {/* ----------PLATFORM CREATE BLOCK--------------- */}

                <div
                  onClick={openPlatformCreateModal}
                  className="create-block platform-block block"
                  style={{ gridColumnStart: clientPlatformList?.length + 2 }}
                >
                  {/* <AddCircleOutlineIcon color="primary" className="icon" /> */}
                </div>

                {/* ----------TYPES BLOCK--------------- */}

                {clientTypeList?.map((type, index) => (
                  <div
                    key={type.id}
                    className="block type-block"
                    style={{ gridRowStart: index + 2 }}
                    onClick={() =>
                      navigate(
                        `/settings/auth/matrix/${projectId}/client-type/${type.id}`
                      )
                    }
                  >
                    <div className="info">
                      <div className="title">{type.name}</div>
                    </div>
                    <ButtonsPopover
                      onDeleteClick={deleteType}
                      id={type.id}
                      onEditClick={openTypeEditModal}
                    />
                  </div>
                ))}

                {/* ----------TYPE CREATE BLOCK--------------- */}

                <div
                  onClick={openTypeCreateModal}
                  className="create-block type-block block"
                  style={{ gridRowStart: clientTypeList?.length + 2 }}
                >
                  {/* <AddCircleOutlineIcon color="primary" className="icon" /> */}
                </div>

                {/* -------------CLIENTS LSIT---------------- */}

                {comutedClientsList?.map((client) => (
                  <ClientBlock
                    key={client.client_platform_id + client.client_type_id}
                    client={client}
                    computedRelationTypes={computedRelationTypes}
                    updateClient={updateClient}
                    removeClient={removeClient}
                  />
                ))}

                {/* -------------EMPTY BLOCKS-------------------- */}

                {emptyBlock.map((el, index) => (
                  <div
                    className="block empty"
                    key={index}
                    style={{
                      gridColumnStart: el.platformIndex + 2,
                      gridRowStart: el.typeIndex + 2,
                    }}
                    onClick={() => addClient(el)}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
    </>
  )
}

export default AuthMatrix
