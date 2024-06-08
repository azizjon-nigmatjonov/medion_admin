import { Delete, Edit } from "@mui/icons-material"
import { Collapse, Switch } from "@mui/material"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import CollapseIcon from "../../../../components/CollapseIcon"
import CreateRow from "../../../../components/CreateRow"
import CreateRowButton from "../../../../components/CreateRowButton"
import permissionService from "../../../../services/auth/permissionService"

const PermissionsRecursiveBlock = ({
  permissions,
  permission,
  level = 1,
  selectedPermission,
  setSelectedPermission = () => {},
  addPermission = () => {},
  deletePermission = () => {},
  updatePermission = () => {},
  onSwitchChange = () => {},
  selectedPermissions,
  disableActions,
}) => {
  const { platformId } = useParams()
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [editFormVisible, setEditFormVisible] = useState(false)
  const [childBlockVisible, setChildBlockVisible] = useState(false)
  const [formLoader, setFormLoader] = useState(false)
  const [deleteLoader, setDeleteLoader] = useState(false)

  const computedPermissions = useMemo(() => {
    return permissions.filter((el) => el.parent_id === permission.id)
  }, [permissions, permission.id])

  const isActive = useMemo(() => {
    return selectedPermission === permission.id
  }, [selectedPermission, permission.id])

  const rowClickHandler = () => {
    setSelectedPermission(permission.id)
  }

  const createPermission = ({ title }) => {
    setFormLoader(true)

    const data = {
      client_platform_id: platformId,
      name: title,
      parent_id: permission.id,
    }

    permissionService
      .create(data)
      .then((res) => {
        addPermission(res)
        setCreateFormVisible(false)
        setChildBlockVisible(true)
      })
      .finally(() => setFormLoader(false))
  }

  const updateHandler = ({ title }) => {
    setFormLoader(true)

    const data = {
      ...permission,
      name: title,
    }

    permissionService
      .update(data)
      .then((res) => {
        updatePermission(res)
        setEditFormVisible(false)
      })
      .finally(() => setFormLoader(false))
  }

  const deleteHandler = () => {
    setDeleteLoader(true)

    permissionService
      .delete(permission.id)
      .then(() => {
        deletePermission(permission.id)
      })
      .catch(() => setDeleteLoader(false))
  }

  const isChecked = useMemo(() => {
    return selectedPermissions?.includes(permission.id)
  }, [selectedPermissions, permission.id])

  return (
    <>
      <div
        className={`PermissionsRecursiveBlock silver-bottom-border ${
          isActive ? "active" : ""
        }`}
        style={{ paddingLeft: level * 30 }}
        onClick={rowClickHandler}
      >
        {editFormVisible ? (
          <CreateRow
            initialTitle={permission.name}
            onSubmit={updateHandler}
            btnLoader={formLoader}
          />
        ) : (
          <>
            <CollapseIcon
              style={{ opacity: computedPermissions?.length ? 1 : 0 }}
              isOpen={childBlockVisible}
              onClick={(e) => {
                e.stopPropagation()
                setChildBlockVisible((prev) => !prev)
              }}
            />
            <div className="title">{permission.name}</div>

            <div className="btns-block">
              {!disableActions ? (
                <>
                  <CreateRowButton
                    formVisible={createFormVisible}
                    setFunction={setCreateFormVisible}
                    type="rectangle"
                  />
                  <RectangleIconButton
                    onClick={() => setEditFormVisible(true)}
                    color="primary"
                  >
                    <Edit color="primary" />
                  </RectangleIconButton>
                  <RectangleIconButton
                    onClick={deleteHandler}
                    loader={deleteLoader}
                    color="error"
                  >
                    <Delete color="error" />
                  </RectangleIconButton>{" "}
                </>
              ) : (
                <Switch checked={isChecked} onChange={(_, val) => onSwitchChange(permission.id, val)} />
              )}
            </div>
          </>
        )}
      </div>

      <Collapse in={createFormVisible} className="silver-bottom-border">
        <CreateRow
          onSubmit={createPermission}
          loader={formLoader}
          setLoader={setFormLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
        />
      </Collapse>
        
      <Collapse in={childBlockVisible && !editFormVisible}>
        {computedPermissions.map((el) => (
          <PermissionsRecursiveBlock
            key={el.id}
            permissions={permissions}
            permission={el}
            level={level + 1}
            selectedPermission={selectedPermission}
            setSelectedPermission={setSelectedPermission}
            addPermission={addPermission}
            deletePermission={deletePermission}
            updatePermission={updatePermission}
            disableActions={disableActions}
            onSwitchChange={onSwitchChange}
            selectedPermissions={selectedPermissions}
          />
        ))}
      </Collapse>
    </>
  )
}

export default PermissionsRecursiveBlock
