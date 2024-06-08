import { useLocation } from "react-router-dom";


const ReloadWrapper = (props) => {
  const location = useLocation();



  return ( <props.component key={location.key} {...props} /> );
}
 
export default ReloadWrapper;