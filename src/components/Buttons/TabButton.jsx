import styles from "./style.module.scss"

const TabButton = ({ children, ...props }) => {
  return (
    <div className={styles.tabButtonWrapper} >
      <button className={styles.tabButton} {...props}>
        {children}
      </button>
    </div>
  )
}

export default TabButton
