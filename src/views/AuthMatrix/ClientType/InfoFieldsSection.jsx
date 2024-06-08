import { Collapse } from "@mui/material"
import { useState } from "react"
import RowLinearLoader from "../../../components/RowLinearLoader"
import CreateRowButton from "../../../components/CreateRowButton"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import clientInfoFieldService from "../../../services/auth/clientInfoFieldService"
import InfoFieldCreateRow from "./InfoFieldCreateRow"
import InfoFieldsRow from "./InfoFieldsRow"

const InfoFieldsSection = ({ fieldsList, setFieldsList }) => {
  const { typeId } = useParams()

  // const loader = useSelector((state) => state.version.loader)

  const loader = false

  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)

  const createNewField = (values) => {
    const data = {
      ...values,
      client_type_id: typeId,
    }

    setCreateLoader(true)
    clientInfoFieldService
      .create(data)
      .then((res) => {
        setCreateFormVisible(false)
        setFieldsList((prev) => [...prev, res])
      })
      .catch(() => setCreateLoader(false))
  }

  return (
    <>
      <div className="card silver-right-border" style={{ flex: 1 }}>
        <div className="card-header silver-bottom-border">
          <div className="card-title">INFO FIELDS</div>
          <div className="card-extra">
            <CreateRowButton
              formVisible={createFormVisible}
              setFunction={setCreateFormVisible}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>

        <Collapse in={createFormVisible} className="silver-bottom-border">
          <InfoFieldCreateRow
            onSubmit={createNewField}
            loader={createLoader}
            setLoader={setCreateLoader}
            visible={createFormVisible}
            setVisible={setCreateFormVisible}
            placeholder="Role title"
          />
        </Collapse>

        {fieldsList?.map((field, index) => (
          <InfoFieldsRow
            setFieldsList={setFieldsList}
            key={field.id}
            field={field}
            index={index}
          />
        ))}
      </div>
    </>
  )
}

export default InfoFieldsSection
