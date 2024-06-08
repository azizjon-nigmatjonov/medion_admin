import usePaperSize from "../../../hooks/usePaperSize"
import styles from "./style.module.scss"

const PageSizeBlock = ({
  selectedPaperSizeIndex,
  setSelectedPaperSizeIndex,
}) => {
  const { paperSizes } = usePaperSize()

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>Формат документа</div>
      </div>

      <div className={styles.docList}>
        <div className={styles.pageSizeRow}>
          <h3>Paper</h3>
        </div>

        {paperSizes.map((paper, index) => (
          <div
            onClick={() => setSelectedPaperSizeIndex(index)}
            key={paper.name}
            className={`${styles.pageSizeRow} ${selectedPaperSizeIndex === index ? styles.pageSizeRowActive : ''}`}
          >
            {paper.name}
            <span className={styles.pageSizeValue}>
              {paper.width} x {paper.height}
            </span>
          </div>
        ))}

        {/* {templates?.map((template) => (
          <div
            key={template.id}
            className={`${styles.row} ${
              selectedTemplate?.id === template.id ? styles.active : ""
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.title}
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default PageSizeBlock
