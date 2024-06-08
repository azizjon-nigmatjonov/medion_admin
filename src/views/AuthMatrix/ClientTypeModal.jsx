import { Card, IconButton, Modal, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import CancelButton from "../../components/Buttons/CancelButton"
import CreateButton from "../../components/Buttons/CreateButton"
import SaveButton from "../../components/Buttons/SaveButton"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import HFTextField from "../../components/FormElements/HFTextField"
import HFCheckbox from "../../components/FormElements/HFCheckbox"

const ClientTypeModal = ({
  closeModal,
  createType,
  updateType,
  loading,
  modalType,
  selectedType,
}) => {
  const { projectId } = useParams()

  const onSubmit = (data) => {
    if (modalType === "typeCreate") return createType(data)

    updateType({
      ...selectedType,
      ...data,
    })
  }

  const {control, handleSubmit} = useForm({
    defaultValues: {
      confirm_by: 1,
      name: selectedType?.name ?? "",
      self_recover: selectedType?.self_recover ?? false,
      self_register: selectedType?.self_register ?? false,
      project_id: projectId,
    }
  })

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "typeCreate"
                ? "Create client type"
                : "Edit client type"}
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-elements">
              <HFTextField
                autoFocus
                fullWidth
                label="Name"
                control={control}
                name="name"
              />

              <HFCheckbox
                label="Self recover"
                control={control}
                name="self_recover"
              />

              <HFCheckbox
                label="Self register"
                control={control}
                name="self_register"
              />
            </div>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              {modalType === "typeCreate" ? (
                <CreateButton type="submit" loading={loading} />
              ) : (
                <SaveButton type="submit" loading={loading} />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  )
}

export default ClientTypeModal
