import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationListActions } from "../store/application/application.thunk";


const GlobalFunctionsProvider = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.auth.isAuth)

  useEffect(() => {
    if(!isAuth) return

    dispatch(fetchApplicationListActions())
  }, [dispatch, isAuth])


  return null;
}
 
export default GlobalFunctionsProvider;