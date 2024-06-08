import { useSelector } from "react-redux";
import AppSelector from "../../components/AppSelector";
import ExitButton from "../../components/Buttons/ExitButton";
import ProfilePanel from "../../components/ProfilePanel";
import UserAvatar from "../../components/UserAvatar";
import RouteTabComponent from "./RouteTabComponent";
import styles from "./style.module.scss";

const RouterTabsBlock = () => {
  const tabs = useSelector((state) => state.tabRouter.tabs);

  return (
    <div className={styles.tabsBlock}>
      <div className={styles.leftSide}>
        {tabs.map((tab) => (
          <RouteTabComponent key={tab.id} tab={tab} />
        ))}

        {/* <FormSelector /> */}
      </div>

      <div className={styles.rightSide}>
        <AppSelector />
        <ProfilePanel />
      </div>
    </div>
  );
};

export default RouterTabsBlock;
