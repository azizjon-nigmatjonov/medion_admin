import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../../components/Header"
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import useBooleanState from "../../../hooks/useBooleanState"
import clientPlatformService from "../../../services/auth/clientPlatformService"
import PermissionsBlock from "./PermissionsBlock"
import ScopesBlock from "./ScopesBlock"
import PermissionScopesBlock from "./ScopesBlock/PermissionScopesBlock"
import "./style.scss"

const ClientPlatform = () => {
  const { platformId, projectId } = useParams()
  const [permissions, setPermissions] = useState([])
  const [scopes, setScopes] = useState([])
  const [loader, turnOnLoader, turnOffLoader] = useBooleanState(false)
  const [selectedPermission, setSelectedPermission] = useState(null)

  const getPlatformData = () => {
    turnOnLoader()

    clientPlatformService
      .getDetail(platformId)
      .then((res) => {
        setPermissions(res.permissions ?? [])
        setScopes(res.scopes ?? [])
      })
      .finally(() => turnOffLoader())
  }

  useEffect(() => {
    getPlatformData()
  }, [])

  return (
    <div className="ClientPlatform">
      <Header title="Platform" backButtonLink={`/settings/auth/matrix/${projectId}`} />

      {loader ? (
        <div className="main-area">
          <div className="card">
            <RingLoaderWithWrapper />
          </div>
        </div>
      ) : (
        <div className="main-area">
          <div className="card">
            <div className="side silver-right-border">
              <PermissionsBlock
                permissions={permissions}
                setPermissions={setPermissions}
                selectedPermission={selectedPermission}
                setSelectedPermission={setSelectedPermission}
              />
            </div>
            <div className="side">
              <ScopesBlock scopes={scopes} />
              <PermissionScopesBlock scopes={scopes} selectedPermission={selectedPermission} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientPlatform
