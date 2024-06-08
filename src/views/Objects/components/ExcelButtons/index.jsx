import ExcelDownloadButton from "./ExcelDownloadButton";
import ExcelUploadButton from "./ExcelUploadButton";
import style from "./style.module.scss";

const ExcelButtons = ({ fieldsMap }) => {
  return (
    <>
      <ExcelUploadButton fieldsMap={fieldsMap} />

      <ExcelDownloadButton />
    </>
  );
};

export default ExcelButtons;
