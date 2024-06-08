import "./style.scss"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"

const SprintSubtasksListType = ({ listType, setListType }) => {

  return (
    <div className="SprintSubtasksListType">
      <div onClick={() => setListType('list')} className={`btn ${listType === "list" ? "active" : ""}`}>
        <FormatListBulletedIcon className="icon" /> List view
      </div>
      <div onClick={() => setListType('group')} className={`btn ${listType === "group" ? "active" : ""}`}>
        <FolderOpenIcon className="icon" /> Group by type
      </div>
      <div onClick={() => setListType('groupByTask')} className={`btn ${listType === "groupByTask" ? "active" : ""}`}>
        <FolderOpenIcon className="icon" /> Group by task
      </div>
      <div onClick={() => setListType('groupByStage')} className={`btn ${listType === "groupByStage" ? "active" : ""}`}>
        <FolderOpenIcon className="icon" /> Group by stage
      </div>
    </div>
  )
}

export default SprintSubtasksListType
