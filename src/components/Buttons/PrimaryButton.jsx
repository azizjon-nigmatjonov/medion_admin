import { CircularProgress } from "@mui/material"
import styles from "./style.module.scss"

const PrimaryButton = ({ disabled, children, className, size, color, error, loader, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={`${styles.button} ${disabled ? styles.disabled : styles.primary} ${styles[color]} ${styles[size]} ${className}`}
      {...props}
    >
      {loader && <CircularProgress size={13} color="secondary"  />}
      {children}
    </button>
  )
}

export default PrimaryButton
