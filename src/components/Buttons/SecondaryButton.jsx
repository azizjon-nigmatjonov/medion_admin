import styles from "./style.module.scss"

const SecondaryButton = ({
  children,
  className,
  color = "primary",
  size,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles.secondary} ${styles[size]} ${
        styles[color]
      } ${disabled ? styles.disabled : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default SecondaryButton
