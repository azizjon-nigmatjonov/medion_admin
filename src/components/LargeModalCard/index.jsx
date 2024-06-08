import { Close } from "@mui/icons-material"
import { Card, IconButton, Modal } from "@mui/material"
import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"
import RippleLoader from "../Loaders/RippleLoader"
import styles from "./style.module.scss"
  
const LargeModalCard = ({
  title,
  children,
  onClose,
  onSaveButtonClick,
  btnLoader,
  oneColumn,
  loader,
}) => {
  return (
    <div>
      <Modal open className={styles.modal} onClose={onClose}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <div></div>
            <div className={styles.cardTitle}>{title}</div>
            <IconButton className={styles.closeButton} onClick={onClose}>
              <Close className={styles.closeIcon} />
            </IconButton>
          </div>

          {loader ? (
            <div className={styles.loader} >
               <RippleLoader />
            </div>
          ) : (
            <div className={styles.body}>
              <div className={`${styles.formWrapper} ${oneColumn ? styles.oneColumn : ''}`}>{children}</div>
            </div>
          )}

          <dir className={styles.footer}>
            <SecondaryButton
              size="large"
              className={styles.button}
              onClick={onClose}
            >
              Отменить
            </SecondaryButton>
            <PrimaryButton
              size="large"
              className={styles.button}
              onClick={onSaveButtonClick}
              loader={btnLoader}
            >
              Сохранить
            </PrimaryButton>
          </dir>
        </Card>
      </Modal>
    </div>
  )
}

export default LargeModalCard
