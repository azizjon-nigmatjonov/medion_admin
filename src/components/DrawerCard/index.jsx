import { Close } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import PrimaryButton from "../Buttons/PrimaryButton";
import styles from "./style.module.scss";

const DrawerCard = ({
  children,
  onClose = () => {},
  title = "",
  open,
  onSaveButtonClick = () => {},
  loader,
  bodyStyle
}) => {
  return (
    <Drawer
      open={open}
      anchor="right"
      classes={{ paperAnchorRight: styles.verticalDrawer }}
      onClose={onClose}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <IconButton className={styles.closeButton} onClick={onClose}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>
      <div className={styles.body} style={bodyStyle}>{children}</div>

      <dir className={styles.footer}>
        <PrimaryButton
          size="large"
          className={styles.button}
          onClick={onSaveButtonClick}
          loader={loader}
        >
          Сохранить
        </PrimaryButton>
      </dir>
    </Drawer>
  );
};

export default DrawerCard;
