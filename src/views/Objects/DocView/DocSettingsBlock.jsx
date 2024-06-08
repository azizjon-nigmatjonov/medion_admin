import ExportBlock from "./ExportBlock";
import PageSizeBlock from "./PageSizeBlock";
import styles from "./style.module.scss";

const DocSettingsBlock = ({
  selectedSettingsTab,
  exportToPDF,
  pdfLoader,
  selectedPaperSizeIndex,
  setSelectedPaperSizeIndex,
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
  relationViewIsActive,
  setlLinkedObjectView,
  setSelectedObject,
  selectedObject,
  isChecked,
  exportButNotOpen,
  exportPdfLoader,
  setCustomTitle,
  customTitle
}) => {
  return (
    <div className={styles.docSettingsBlock}>
      {selectedSettingsTab === 0 && (
        <PageSizeBlock
          selectedPaperSizeIndex={selectedPaperSizeIndex}
          setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
        />
      )}
      {selectedSettingsTab === 1 && (
        <ExportBlock
          exportPdfLoader={exportPdfLoader}
          exportButNotOpen={exportButNotOpen}
          exportToPDF={exportToPDF}
          pdfLoader={pdfLoader}
          htmlLoader={htmlLoader}
          exportToHTML={exportToHTML}
          setSelectedOutputTable={setSelectedOutputTable}
          selectedOutputTable={selectedOutputTable}
          selectedOutputObject={selectedOutputObject}
          setSelectedOutputObject={setSelectedOutputObject}
          templates={templates}
          selectedTemplate={selectedTemplate}
          selectedLinkedObject={selectedLinkedObject}
          setSelectedLinkedObject={setSelectedLinkedObject}
          relationViewIsActive={relationViewIsActive}
          setlLinkedObjectView={setlLinkedObjectView}
          setSelectedObject={setSelectedObject}
          selectedObject={selectedObject}
          isChecked={isChecked}
          setCustomTitle={setCustomTitle}
          customTitle={customTitle}
        />
      )}
    </div>
  );
};

export default DocSettingsBlock;
