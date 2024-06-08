import { Close } from "@mui/icons-material"
import Save from "@mui/icons-material/Save"
import { CircularProgress, IconButton } from "@mui/material"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ButtonsPopover from "../../components/ButtonsPopover"
import CSelect from "../../components/CSelect"
import clientService from "../../services/auth/clientService"
import { LOGIN_STRATEGIES } from "../../utils/constants/authMatrix"

const ClientBlock = ({
  client,
  computedRelationTypes,
  updateClient,
  removeClient,
}) => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [editFormVisible, setEditFormVisible] = useState(false)
  const [strategy, setStrategy] = useState(client.login_strategy ?? 0)
  const [loader, setLoader] = useState(false)

  const deleteHandler = () => {
    setLoader(true)
    clientService
      .delete(client)
      .then((res) => {
        removeClient(client)
      })
      .catch(() => setLoader(false))
  }

  const closeEditForm = () => {
    setStrategy(client.login_strategy)
    setEditFormVisible(false)
  }

  const openEditForm = () => setEditFormVisible(true)

  const saveChanges = () => {
    const data = {
      ...client,
      login_strategy: strategy,
    }

    setLoader(true)

    clientService
      .update(data)
      .then((res) => {
        updateClient(res)
        setEditFormVisible(false)
      })
      .finally(() => setLoader(false))
  }

  const navigateToClientList = (e) => {
    e.stopPropagation()
    if (editFormVisible) return null
    navigate(
      `/settings/auth/matrix/${projectId}/${client.client_platform_id}/${client.client_type_id}/crossed`
    )
  }

  return (
    <div
      className="block"
      style={{
        gridRowStart: client.row,
        gridColumnStart: client.column,
      }}
      onClick={navigateToClientList}
    >
      {!editFormVisible ? (
        <>
          <div className="subtitle">{LOGIN_STRATEGIES[strategy]}</div>
          <ButtonsPopover
            loading={loader}
            onEditClick={openEditForm}
            onDeleteClick={deleteHandler}
          />
        </>
      ) : (
        <>
          <CSelect
            options={computedRelationTypes}
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          />
          <IconButton color="primary" onClick={saveChanges}>
            {loader ? <CircularProgress size={17} /> : <Save />}
          </IconButton>
          <IconButton color="error" onClick={closeEditForm}>
            <Close />
          </IconButton>
        </>
      )}
    </div>
  )
}

export default ClientBlock
