import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Sidebar2222 from "../../components/Sidebar2222"
import styles from "./style.module.scss"

const SettingsLayout = () => {
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchConstructorTableListAction())
  // }, [dispatch])


  return (
    <div className={styles.layout}>
      <Sidebar2222 />
      <div className={styles.content}>

        {/* <RouterTabsBlock /> */}

        <Outlet />
      </div>
    </div>
  )
}

export default SettingsLayout