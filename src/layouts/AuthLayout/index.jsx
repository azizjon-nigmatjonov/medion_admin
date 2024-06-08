import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import config from "../../../builder_config/config.json";

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.leftSide}>
        <div></div>
        <div className={styles.logoBlock}>
          <h1 className={styles.logoTitle}>{config?.company_name}</h1>
          <p className={styles.logoSubtitle}>{config?.company_subtitle}</p>
        </div>

        <div className={styles.subtitleBlock}>© Umed. Все права защищены</div>
      </div>
      <div className={styles.rightSide}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
