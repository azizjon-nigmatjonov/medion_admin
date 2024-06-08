import { InsertDriveFile } from "@mui/icons-material";
import IconGenerator from "../../../components/IconPicker/IconGenerator";

const FileIconGenerator = ({ type }) => {
  switch (type) {
    case 'pdf':
      return <IconGenerator icon={'file-pdf.svg'} />
  
    case 'png':
     case 'jpg':
       case 'jpeg':
        return <IconGenerator icon={'image.svg'} />

    default:
      return <IconGenerator icon={'file.svg'} />
  }
}
 
export default FileIconGenerator;