import { Card, IconButton, Modal, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import CancelButton from "../../components/Buttons/CancelButton"
import CreateButton from "../../components/Buttons/CreateButton"
import SaveButton from "../../components/Buttons/SaveButton"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import HFTextField from "../../components/FormElements/HFTextField"

const PlatformModal = ({
  closeModal,
  createPlatform,
  updatePlatform,
  loading,
  modalType,
  selectedPlatform,
}) => {
  const { projectId } = useParams()

  const onSubmit = (data) => {
    if (modalType === "platformCreate") return createPlatform(data)

    updatePlatform({
      ...selectedPlatform,
      ...data,
    })
  }

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: selectedPlatform?.name ?? "",
      subdomain: selectedPlatform?.subdomain ?? "",
      project_id: projectId,
    }
  })


  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "platformCreate"
                ? "Create platform"
                : "Edit platform"}
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

              <HFTextField
                fullWidth
                label="Subdomain"
                control={control}
                name="subdomain"
              />
            </div>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              {modalType === "platformCreate" ? (
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

export default PlatformModal
