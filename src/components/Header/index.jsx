import BackButton from "../BackButton";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";

const Header = ({
  title = "",
  subtitle,
  extra,
  children,
  loader,
  backButtonLink,
  icon,
  sticky,
  ...props
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`${styles.header} ${sticky ? styles.sticky : ""}`}
      {...props}
    >
      <div className={styles.leftSide}>
        {backButtonLink && (
          <BackButton
            link={backButtonLink}
            onClick={() => navigate(backButtonLink)}
          />
        )}

        {icon && <IconGenerator className={styles.icon} icon={icon} />}

        <div className={styles.titleBlock}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>

        <div className={styles.line} />

        <div>{children}</div>
      </div>

      <div className={styles.rightSide}>{extra}</div>
    </div>
  );
};

export default Header;
