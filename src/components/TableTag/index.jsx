
import style from "./style.module.scss"

const TableTag = ({ color, children }) => {
  return ( <div className={`${style.tag} ${style[color] ?? ''}`} >
    {children}
  </div> );
}
 
export default TableTag;