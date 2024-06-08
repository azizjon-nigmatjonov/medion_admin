



import { CircularProgress, MenuItem } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import ButtonsPopover from "../../../components/ButtonsPopover"
// import { versionActions } from "../../../redux/slices/version.slice"
import clientInfoFieldService from "../../../services/auth/clientInfoFieldService"
import InfoFieldCreateRow from "./InfoFieldCreateRow"

const InfoFieldsRow = ({ field, index, setFieldsList }) => {
  const { typeId } = useParams()
  const dispatch = useDispatch()

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)

    const deleteField = () => {
      setLoader(true)
      clientInfoFieldService
        .delete(field.id)
        .then((res) => {
          setFieldsList(prev => prev.filter(el => el.id !== field.id))
        })
        .catch(() => setLoader(false))
    }

  const updateField = (values) => {
    const data = {
      ...values,
      client_type_id: typeId,
      id: field.id
    }

    clientInfoFieldService.update(data).then((res) => {
      setFieldsList(prev => prev.map(el => el.id !== field.id ? el : data))
      setTextFieldVisible(false)
    })
  }

  const selectHandler = () => {
    // dispatch(versionActions.setSelectedVersionId(field.id))
  }

  return (
    <MenuItem
      className={`row silver-bottom-border pointer`}
      onClick={selectHandler}
    >
      <div className="row-index">{index + 1}</div>
      {textFieldVisible ? (
        <InfoFieldCreateRow
          color="primary"
          initialValues={field}
          onSubmit={updateField}
          btnText="SAVE"
        />
      ) : (
        <>
          <div className="row-label">{field?.field_name}</div>
          <div className="row-btns">
            {loader ? (
              <div style={{ padding: "12px" }}>
                <CircularProgress disableShrink size={20} />
              </div>
            ) : (
              <ButtonsPopover
                onDeleteClick={deleteField}
                onEditClick={() => setTextFieldVisible(true)}
              />
            )}
          </div>
        </>
      )}
    </MenuItem>
  )
}

export default InfoFieldsRow
