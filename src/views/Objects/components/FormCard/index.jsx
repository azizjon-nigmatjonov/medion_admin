import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import styles from "./style.module.scss"

const FormCard = ({ title, children, icon, extra }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeftSide}>
          {icon && <div className={styles.iconBlock} >
            <IconGenerator icon={icon} size={14}  />
          </div>}
          <h4 className={styles.title}>
            {title}
          </h4>
        </div>

        <div className={styles.headerRightSide}>{extra}</div>

      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default FormCard
