import { Download } from "@mui/icons-material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import useDownloader from "../../../../hooks/useDownloader";
import constructorObjectService from "../../../../services/constructorObjectService";
import style from "./style.module.scss";

const ExcelDownloadButton = ({
  relatedTable,
  fieldSlug,
  fieldSlugId,
  withText,
  sort,
}) => {
  const { tableSlug } = useParams();
  const { download } = useDownloader();
  const [loader, setLoader] = useState(false);
  const onClick = async () => {
    try {
      setLoader(true);
      const { data } = await constructorObjectService.downloadExcel(
        relatedTable ? relatedTable : tableSlug,
        {
          data: {
            [fieldSlug]: fieldSlugId,
            ...sort,
          },
        }
      );

      const fileName = `${relatedTable ? relatedTable : tableSlug}.xlsx`;
      // window.open('https://' + data.link, { target: '__blank' })
      await download({ link: "https://" + data.link, fileName });
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className={style.excelUpload} onClick={onClick}>
      <RectangleIconButton loader={loader} color="white" onClick={onClick}>
        {withText ? "Экспорт" : null}
        <Download />
      </RectangleIconButton>
      <span>Excel download</span>
    </div>
  );
};

export default ExcelDownloadButton;
