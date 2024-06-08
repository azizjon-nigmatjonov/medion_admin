import * as React from "react"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import HFSelect from "../../components/FormElements/HFSelect"
import HFTextField from "../../components/FormElements/HFTextField"
import { FilterIcon } from "../../assets/icons/icon"
import styles from "./styles.module.scss"
import { useState } from "react"

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
}

const CreateLoginModal = ({
  open = true,
  tables = [],
  fields = [],
  loginOptions = [],
  loginForm = {},
  setOpen = () => {},
  getFields = () => {},
  handleSubmit = () => {},
  isEditing = false,
}) => {
  const handleClose = () => {
    setOpen(false)
    loginForm.reset()
  }
  const [strategyType, setStrategyType] = useState("")

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
              <div className={styles.card_header_left} style={{ flexGrow: 1 }}>
                <div className={styles.card_header_title}>
                  {strategyType === "3"
                    ? "Логин с e-mail"
                    : strategyType === "2"
                    ? "Логин с тел. номером"
                    : "Логин с паролем"}
                </div>
                <HFSelect
                  options={loginOptions}
                  control={loginForm.control}
                  name="login_strategy"
                  onChange={(e) => {
                    loginForm.setValue("login_strategy", e)
                    setStrategyType(e)
                  }}
                  required
                />
                <HFSelect
                  options={tables}
                  control={loginForm.control}
                  onChange={(e) => {
                    getFields({ table_id: e })
                  }}
                  name="login_table.object_id"
                  required
                />
              </div>
            </div>
            <div className={styles.card_body}>
              <div className={styles.card_body_head}>
                <div>
                  Название
                  <FilterIcon />
                </div>
                <div>
                  View field
                  <FilterIcon />
                </div>
              </div>
              <div className={styles.card_body_items}>
                <div>
                  <HFTextField
                    name="login"
                    onChange={(e) => {
                      loginForm.setValue("login", e.target.value)
                    }}
                    control={loginForm.control}
                    fullWidth
                  />
                  <HFTextField
                    name="password"
                    onChange={(e) => {
                      loginForm.setValue("password", e.target.value)
                    }}
                    control={loginForm.control}
                    fullWidth
                  />
                </div>
                <div>
                  <HFSelect
                    options={fields}
                    control={loginForm.control}
                    name="login_table.view_fields[0]"
                    onChange={(e) => {
                      loginForm.setValue("login_table.view_fields[0]", e)
                    }}
                    required
                  />
                  <HFSelect
                    options={fields}
                    control={loginForm.control}
                    name="login_table.view_fields[1]"
                    onChange={(e) => {
                      loginForm.setValue("login_table.view_fields[1]", e)
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
                handleClose()
                loginForm.reset()
              }}
            >
              Cancel
            </button>
            <button
              className={styles.craete_btn}
              onClick={() => {
                handleSubmit()
                handleClose()
              }}
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default CreateLoginModal
