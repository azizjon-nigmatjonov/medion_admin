import { useMemo } from "react"
import PermissionsRecursiveBlock from "./PermissionsRecursiveBlock"
import "./style.scss"

const PermissionsBlock = ({
  permissions,
  selectedPermission,
  setSelectedPermission,
  setPermissions
}) => {

  const computedPermissions = useMemo(() => {
    return permissions.filter((permission) => !permission.parent_id)
  }, [permissions])

  const addPermission = (data) => {
    setPermissions(prev => [...prev, data])
  }

  const deletePermission = (id) => {
    setPermissions(prev => prev.filter(el => el.id !== id))
  }

  const updatePermission = (data) => {
    setPermissions(prev => prev.map(el => (el.id === data.id ? data : el)))
  }

  return (
    <div className="PermissionsBlock">
      <div className="card-header silver-bottom-border">
        <h4 className="card-title">PERMISSIONS</h4>
      </div>
      <div className="rows-block">
        {computedPermissions.map((permission) => (
          <PermissionsRecursiveBlock
            key={permission.id}
            permissions={permissions}
            permission={permission}
            selectedPermission={selectedPermission}
            setSelectedPermission={setSelectedPermission}
            addPermission={addPermission}
            deletePermission={deletePermission}
            updatePermission={updatePermission}
          />
        ))}
      </div>
    </div>
  )
}

export default PermissionsBlock
