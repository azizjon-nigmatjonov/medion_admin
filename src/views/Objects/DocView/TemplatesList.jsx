import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import PageFallback from "../../../components/PageFallback";
import SearchInput from "../../../components/SearchInput";
import { generateID } from "../../../utils/generateID";
import styles from "./style.module.scss";

const TemplatesList = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  templateFields,
  onChange,
  setSelectedOutputTable,
  setSelectedOutputObject,
  setSelectedLinkedObject,
  isLoading,
}) => {
  const { tableSlug } = useParams();

  const onCreateButtonClick = () => {
    const data = {
      id: generateID(),
      title: "NEW",
      type: "CREATE",
      table_slug: tableSlug,
      html: "",
    };
    setSelectedTemplate(data);
    setSelectedOutputTable("");
    setSelectedOutputObject("");
    // setSelectedLinkedObject("");
  };

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>Шаблоны</div>

        <IconButton onClick={onCreateButtonClick}>
          <Add />
        </IconButton>
      </div>

      <div className={styles.docList}>
        <div className={styles.search_section}>
          <SearchInput size="small" fullWidth onChange={onChange} />
        </div>
        {isLoading ? (
          <PageFallback />
        ) : (
          templates?.map((template) => (
            <div
              key={template.id}
              className={`${styles.row} ${
                selectedTemplate?.guid === template.guid ? styles.active : ""
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              {template.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TemplatesList;
