import "./style.scss"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"

const FileSystemTypeSelector = ({ fileSystemType, setFileSystemType }) => {

  
  return (
    <div className="FileSystemTypeSelector">
      <div onClick={() => setFileSystemType('list')} className={`btn ${fileSystemType === "list" ? "active" : ""}`}>
        <FormatListBulletedIcon className="icon" /> List view
      </div>
      <div onClick={() => setFileSystemType('detailed')} className={`btn ${fileSystemType === "detailed" ? "active" : ""}`}>
        <FolderOpenIcon className="icon" /> Detailed view
      </div>
    </div>
  )
}

export default FileSystemTypeSelector
