



import { CircularProgress, MenuItem } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import ButtonsPopover from "../../../components/ButtonsPopover"
import clientRelationService from "../../../services/auth/clientRelationService"
import RelationCreateRow from "./RelationCreateRow"

const RelationsRow = ({ relation, index, setRelationsList }) => {
  const { typeId } = useParams()
  const dispatch = useDispatch()

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)

    const deleteRelation = () => {
      setLoader(true)
      clientRelationService
        .delete(relation.id)
        .then((res) => {
          setRelationsList(prev => prev.filter(el => el.id !== relation.id))
        })
        .catch(() => setLoader(false))
    }

  const updateRelation = (values) => {
    const data = {
      ...values,
      client_type_id: typeId,
      id: relation.id
    }

    clientRelationService.update(data).then((res) => {
      setRelationsList(prev => prev.map(el => el.id !== relation.id ? el : data))
      setTextFieldVisible(false)
    })
  }

  return (
    <MenuItem
      className={`row silver-bottom-border pointer`}
    >
      <div className="row-index">{index + 1}</div>
      {textFieldVisible ? (
        <RelationCreateRow
          color="primary"
          initialValues={relation}
          onSubmit={updateRelation}
          btnText="SAVE"
        />
      ) : (
        <>
          <div className="row-label">{relation?.name}</div>
          <div className="row-btns">
            {loader ? (
              <div style={{ padding: "12px" }}>
                <CircularProgress disableShrink size={20} />
              </div>
            ) : (
              <ButtonsPopover
                onDeleteClick={deleteRelation}
                onEditClick={() => setTextFieldVisible(true)}
              />
            )}
          </div>
        </>
      )}
    </MenuItem>
  )
}

export default RelationsRow
