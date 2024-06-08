import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import CSelect from "../../../../components/CSelect";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import documentTemplateService from "../../../../services/documentTemplateService";
import listToOptions from "../../../../utils/listToOptions";
import styles from "./style.module.scss";

const Form = ({ closeMenu }) => {
  const navigate = useNavigate();
  const { appId, tableSlug, id: objectId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { data: templates = [] } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      return documentTemplateService.getList({ table_slug: tableSlug });
    },
    {
      select: (res) => {
        return res.htmlTemplates ?? [];
      },
    }
  );

  const templateOptions = useMemo(() => {
    return listToOptions(templates);
  }, [templates]);

  const navigateToDocumentEditPage = () => {
    const template = templates.find((el) => el.id === selectedTemplate);

    const state = {
      toDocsTab: true,
      template: template,
      object_id: objectId,
    };

    closeMenu();
    navigate(`/main/${appId}/object/${tableSlug}`, { state });
  };

  return (
    <div className={styles.form}>
      <CSelect
        disabledHelperText
        placeholder="Template"
        value={selectedTemplate ?? ""}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        options={templateOptions}
      />
      <RectangleIconButton onClick={navigateToDocumentEditPage}>
        <IconGenerator icon="arrow-up-right-from-square.svg" size={18} />
      </RectangleIconButton>
    </div>
  );
};

export default Form;
