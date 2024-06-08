import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../../components/Header"
import HeaderSettings from "../../../components/HeaderSettings"
import clientTypeService from "../../../services/auth/clientTypeService"
import InfoFieldsSection from "./InfoFieldsSection"
import RelationsSection from "./RelationsSection"
import "./style.scss"
import TablesSection from "./TablesSection"

const ClientType = () => {
  const { typeId, projectId } = useParams()

  const [loader, setLoader] = useState(true)
  const [rolesList, setRolesList] = useState([])
  const [fieldsList, setFieldsList] = useState([])
  const [relationsList, setRelationsList] = useState([])
  const [data, setData] = useState({})
  const [tables, setTables] = useState([])

  const getData = () => {
    setLoader(true)

    clientTypeService
      .getById(typeId)
      .then((res) => {
        setData(res.client_type ?? {})
        setTables(res.client_type?.tables ?? [])
        setRolesList(res.roles ?? [])
        setFieldsList(res.user_info_fields ?? [])
        setRelationsList(res.relations ?? [])
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="ClientType">
      <HeaderSettings
        title="Client-type"
        backButtonLink={`/settings/auth/matrix/${projectId}`}
      />
      <div className="main-area">
        <RolesBlock rolesList={rolesList} setRolesList={setRolesList} />
        <InfoFieldsSection
          fieldsList={fieldsList}
          setFieldsList={setFieldsList}
        />

        <TablesSection data={data} tables={tables} setTables={setTables} />

        {/* <RelationsSection
          relationsList={relationsList}
          setRelationsList={setRelationsList}
        /> */}
      </div>
    </div>
  )
}

export default ClientType
