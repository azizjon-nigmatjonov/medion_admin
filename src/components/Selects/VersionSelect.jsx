import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { versionActions } from "../../redux/slices/version.slice"
import { getEpicListAction } from "../../redux/thunks/epic.thunk"
import CSelect from "../CSelect"

const VersionSelect = () => {
  const dispatch = useDispatch()

  const versionsList = useSelector((state) => state.version.list)
  const selectedVersion = useSelector(
    (state) => state.version.selectedVersionId
  )

  const setSelectedVersion = (value) => {
    dispatch(versionActions.setSelectedVersionId(value))
  }

  const computedVersionsList = useMemo(() => {
    return versionsList?.map((version) => ({
      label: version.title,
      value: version.id,
    }))
  }, [versionsList])



  if (!versionsList?.[0]) return null

  return (
    <CSelect
      value={selectedVersion}
      onChange={(e) => setSelectedVersion(e.target.value)}
      options={computedVersionsList}
      label="Version"
      width="200px"
    />
  )
}

export default VersionSelect
