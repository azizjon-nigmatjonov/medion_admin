import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import styles from "./styles.module.scss";
import HFIconPicker from "../../components/FormElements/HFIconPicker";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #e8e8e8",
  borderRadius: "6px",
  boxShadow: 24,
  p: 3,
};

const ConnectionCreateModal = ({
  open = false,
  tables = [],
  fields = [],
  connectionForm = {},
  setOpen = () => {},
  getFields = () => {},
  handleSubmit = () => {},
  isEdit = false,
}) => {
  const handleClose = () => {
    setOpen(false);
    connectionForm.reset();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles.card_holder}>
            <div className={styles.card_header}>
              <div className={styles.card_header_left}>
                <HFIconPicker
                  name="icon"
                  control={connectionForm.control}
                  shape="rectangle"
                  onChange={(e) => {
                    connectionForm.setValue("icon", e);
                  }}
                />
                <HFTextField
                  label="Name"
                  name="name"
                  onChange={(e) => {
                    connectionForm.setValue("name", e.target.value);
                  }}
                  control={connectionForm.control}
                  fullWidth
                />
                <HFSelect
                  options={tables}
                  control={connectionForm.control}
                  onChange={(e) => {
                    getFields({ table_id: e });
                    connectionForm.setValue("table_slug", e);
                  }}
                  name="table_slug"
                  required
                />
              </div>
            </div>
            <div className={styles.card_body}>
              <div className={styles.card_body_items}>
                <div>
                  <HFTextField
                    name="view_label"
                    // value={connectionForm.getValues().view_label}
                    onChange={(e) => {
                      connectionForm.setValue("view_label", e.target.value);
                    }}
                    control={connectionForm.control}
                    fullWidth
                  />
                </div>
                <div>
                  <HFSelect
                    options={fields}
                    control={connectionForm.control}
                    name="view_slug"
                    onChange={(e) => {
                      connectionForm.setValue("view_slug", e);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.cancel_btn}
              onClick={() => {
                handleClose();
                connectionForm.reset();
              }}
            >
              Cancel
            </button>
            <button
              className={styles.craete_btn}
              onClick={() => {
                handleSubmit();
                handleClose();
              }}
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ConnectionCreateModal;
