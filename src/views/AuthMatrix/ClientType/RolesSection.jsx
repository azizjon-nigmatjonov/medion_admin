import { Collapse } from "@mui/material"
import { useState } from "react"
import RowLinearLoader from "../../../components/RowLinearLoader"
import CreateRowButton from "../../../components/CreateRowButton"
import { useParams } from "react-router-dom"
import {  useSelector } from "react-redux"
import RolesRow from "./RolesRow"
import roleService from "../../../services/roleService"
import CreateRow from "../../../components/CreateRow"

const RolesBlock = ({ rolesList, setRolesList }) => {
  const { typeId } = useParams()

  const loader = useSelector((state) => state.version.loader)

  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)

  const createNewRole = ({ title }) => {
    const data = {
      name: title,
      client_type_id: typeId,
    }

    setCreateLoader(true)
    roleService
      .create(data)
      .then((res) => {
        setCreateFormVisible(false)
        setRolesList(prev => [...prev, res])
      })
      .catch(() => setCreateLoader(false))
  }

  return (
    <>
      <div className="card silver-right-border" style={{ flex: 1 }}>
        <div className="card-header silver-bottom-border">
          <div className="card-title">ROLES</div>
          <div className="card-extra">
            <CreateRowButton
              formVisible={createFormVisible}
              setFunction={setCreateFormVisible}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>

        <Collapse in={createFormVisible} className="silver-bottom-border">
          <CreateRow
            onSubmit={createNewRole}
            loader={createLoader}
            setLoader={setCreateLoader}
            visible={createFormVisible}
            setVisible={setCreateFormVisible}
            placeholder="Role title"
          />
        </Collapse>

        {rolesList?.map((role, index) => (
          <RolesRow setRolesList={setRolesList} key={role.id} role={role} index={index} />
        ))}
      </div>
    </>
  )
}

export default RolesBlock
