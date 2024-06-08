import { useEffect, useState } from "react"
import { Container } from "react-smooth-dnd"
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper"
import RowLinearLoader from "../../../../components/RowLinearLoader"
import useBooleanState from "../../../../hooks/useBooleanState"
import permissionService from "../../../../services/auth/permissionService"
import { applyDrag } from "../../../../utils/applyDrag"
import ScopeRow from "./ScopeRow"
import "./style.scss"

const PermissionScopesBlock = ({ selectedPermission }) => {
  const [loader, turnOnLoader, turnOffLoader] = useBooleanState(false)
  const [scopesList, setScopesList] = useState([])
  const [linearLoader, turnOnLinearLoader, turnOffLinearLoader] =
    useBooleanState(false)

  const getScopesList = () => {
    turnOnLoader()

    permissionService
      .getById(selectedPermission)
      .then((res) => setScopesList(res.permission_scopes ?? []))
      .finally(() => turnOffLoader())
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(scopesList, dropResult)

    if (result?.length > scopesList?.length) {
      const data = {
        ...dropResult.payload,
        permission_id: selectedPermission,
      }

      const selectedElement = scopesList.find(
        (scope) =>
          scope.method === data.method && scope.path === data.path
      )

      if (selectedElement) return null

      turnOnLinearLoader()

      setScopesList([...scopesList, data])

      permissionService
        .addScopeToPermission(data)
        .catch(() => {
          setScopesList((prev) =>
            prev.filter(
              (scope) =>
                scope.method !== data.method || scope.path !== data.path
            )
          )
        })
        .finally(() => turnOffLinearLoader())
    }
  }

  useEffect(() => {
    if (!selectedPermission) return setScopesList([])
    getScopesList()
  }, [selectedPermission])

  return (
    <div className="PermissionScopesBlock">
      <div className="card-header silver-bottom-border ">
        <h4 className="card-title">PERMISSION SCOPES</h4>
        <RowLinearLoader visible={linearLoader} />
      </div>

      <Container onDrop={onDrop} behaviour="drop-zone" groupName="scopes">
        <div className="rows-block">
          {loader ? (
            <RingLoaderWithWrapper />
          ) : (
            scopesList.map((scope, index) => (
              <ScopeRow scope={scope} key={scope.id} index={index} />
            ))
          )}
        </div>
      </Container>
    </div>
  )
}

export default PermissionScopesBlock
