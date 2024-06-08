import { ReactComponent as FolderIcon } from "../../assets/icons/folder.svg"
import { ReactComponent as OpenedFolderIcon } from "../../assets/icons/opened-folder.svg"

const CollapseFolderIcons = ({ isOpen, ...props }) => {

  if (isOpen) {
    return <OpenedFolderIcon style={{ marginRight: '0px'  }} {...props} />
  }

  return (
    <FolderIcon style={{ marginRight: '0px'  }} {...props} />
  )
}

export default CollapseFolderIcons
