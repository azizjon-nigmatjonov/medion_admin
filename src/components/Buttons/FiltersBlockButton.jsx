import styles from "./style.module.scss"

const FiltersBlockButton = ({ children, className, size="medium", ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles.filtersButton} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default FiltersBlockButton
