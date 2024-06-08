import { CircularProgress } from "@mui/material";
import styles from "./style.module.scss";
import LinkedListTables from "./DynamicObjectsTemplate/LinkedListTables";

const ExportBlock = ({
  pdfLoader,
  exportToPDF,
  htmlLoader,
  exportToHTML,
  setSelectedOutputTable,
  selectedOutputTable,
  selectedOutputObject,
  setSelectedOutputObject,
  templates,
  selectedTemplate,
  selectedLinkedObject,
  setSelectedLinkedObject,
  setSelectedObject,
  selectedObject,
  setlLinkedObjectView,
  exportButNotOpen,
  exportPdfLoader,
  setCustomTitle,
  customTitle,
}) => {
  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>Экспорт</div>
      </div>

      <div className={styles.docList}>
        <div className={styles.pageSizeRow} onClick={exportToPDF}>
          <div className={styles.documentIcon}>PDF</div>Export to PDF
          {pdfLoader && <CircularProgress size={14} />}
        </div>
        <div className={styles.pageSizeRow} onClick={exportButNotOpen}>
          <div className={styles.documentIcon}>Export</div>Export
          {exportPdfLoader && <CircularProgress size={14} />}
        </div>
        <div className={styles.pageSizeRow} onClick={exportToHTML}>
          <div className={styles.documentIcon}>Variable</div> Set variables
          {htmlLoader && <CircularProgress size={14} />}
        </div>

        {selectedTemplate ? (
          <LinkedListTables
            setSelectedOutputTable={setSelectedOutputTable}
            selectedOutputTable={selectedOutputTable}
            selectedOutputObject={selectedOutputObject}
            setSelectedOutputObject={setSelectedOutputObject}
            templates={templates}
            selectedTemplate={selectedTemplate}
            selectedLinkedObject={selectedLinkedObject}
            setSelectedLinkedObject={setSelectedLinkedObject}
            setSelectedObject={setSelectedObject}
            selectedObject={selectedObject}
            setlLinkedObjectView={setlLinkedObjectView}
            exportToHTML={exportToHTML}
            setCustomTitle={setCustomTitle}
            customTitle={customTitle}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ExportBlock;
