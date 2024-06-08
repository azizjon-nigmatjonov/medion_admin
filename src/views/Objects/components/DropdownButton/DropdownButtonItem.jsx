import styles from "./style.module.scss"

const DropdownButtonItem = ({children, ...props}) => {
  return (
    <div
      className={`${styles.menuItem}`}
      {...props}
    >
     
      {children}
    </div>
  )
}

export default DropdownButtonItem
