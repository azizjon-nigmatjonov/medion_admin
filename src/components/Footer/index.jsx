
import styles from "./style.module.scss"


const Footer = ({ children, extra }) => {
  return ( <div className={styles.footer} >
    <div>
      {children}
    </div>

    <div className={styles.extra} >
      {extra}
    </div>

  </div> );
}
 
export default Footer;
