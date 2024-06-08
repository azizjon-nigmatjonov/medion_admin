// ! README:
// ? tabs is required and used for looping. TYPEOF --- Array
// ? tabIndex is required and used for identifying which tab is active. TYPEOF --- Number
import "./style.scss"
const CustomTabs = ({ tabs, tabIndex = 1, setTabIndex = () => {} }) => {
  return (
    <div className="customTabWrapper">
      {tabs?.length &&
        tabs.map((tab) => (
          <div
            key={tab.id}
            className="customTabDetails"
            style={{ color: tabIndex === tab?.id ? "#0E73F6" : "#6E8BB7" }}
            onClick={() => setTabIndex(tab?.id)}
          >
            {tab.name}
            {tabIndex === tab?.id && (
              <span className="customTabIndicator"></span>
            )}
          </div>
        ))}
    </div>
  )
}

export default CustomTabs
