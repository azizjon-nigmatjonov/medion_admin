import { Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useFormik } from "formik";
import FTextField from "../FormElements/FTextField";
import CancelButton from "../Buttons/CancelButton";
import CreateButton from "../Buttons/CreateButton";
import SaveButton from "../Buttons/SaveButton";
import "./style.scss";

const SubtaskCommentModal = ({
  closeModal,
  updateStatus,
  loading,
  selectedStatus,
}) => {
  const onSubmit = ({ comment }) => {
    updateStatus(selectedStatus, comment);
  };

  const formik = useFormik({
    initialValues: { comment: "" },
    onSubmit,
  });

  return (
    <div onKeyDown={(e) => e.stopPropagation()}>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="SubtaskCommentModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              Are you sure you want to change the status?
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={formik.handleSubmit} className="form">
            <div className="form-elements">
              <FTextField
                autoFocus
                fullWidth
                multiline
                rows={4}
                label="Comment"
                formik={formik}
                name="comment"
              />
            </div>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              <SaveButton type="submit" loading={loading} />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default SubtaskCommentModal;
