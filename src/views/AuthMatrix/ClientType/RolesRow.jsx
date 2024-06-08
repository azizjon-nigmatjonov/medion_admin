

import { CircularProgress, MenuItem } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import ButtonsPopover from "../../../components/ButtonsPopover"
import CreateRow from "../../../components/CreateRow"
// import { versionActions } from "../../../redux/slices/version.slice"
import roleService from "../../../services/roleService"

const RolesRow = ({ role, index, setRolesList }) => {
  const { typeId } = useParams()
  const dispatch = useDispatch()

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)

    const deleteRole = () => {
      setLoader(true)
      roleService
        .delete(role.id)
        .then((res) => {
          setRolesList(prev => prev.filter(el => el.id !== role.id))
        })
        .catch(() => setLoader(false))
    }

  const updateRole = ({ title }) => {
    const data = {
      name: title,
      id: role.id,
      client_type_id: typeId,
    }

    setRolesList(prev => prev.map(el => el.id !== role.id ? el : data))

    roleService.update(data).then((res) => {
      // dispatch(
      //   versionActions.edit({
      //     index,
      //     data,
      //   })
      // )
      setTextFieldVisible(false)
    })
  }

  const selectHandler = () => {
    // dispatch(versionActions.setSelectedVersionId(role.id))
  }

  return (
    <MenuItem
      className={`row silver-bottom-border pointer`}
      onClick={selectHandler}
    >
      <div className="row-index">{index + 1}</div>
      {textFieldVisible ? (
        <CreateRow
          color="primary"
          initialTitle={role.name}
          onSubmit={updateRole}
        />
      ) : (
        <>
          <div className="row-label">{role?.name}</div>
          <div className="row-btns">
            {loader ? (
              <div style={{ padding: "12px" }}>
                <CircularProgress disableShrink size={20} />
              </div>
            ) : (
              <ButtonsPopover
                onDeleteClick={deleteRole}
                onEditClick={() => setTextFieldVisible(true)}
              />
            )}
          </div>
        </>
      )}
    </MenuItem>
  )
}

export default RolesRow
