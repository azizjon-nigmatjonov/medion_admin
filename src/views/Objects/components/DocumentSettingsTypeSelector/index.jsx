import {
  DescriptionOutlined,
  FileUploadOutlined,
  ImportExport,
} from "@mui/icons-material";
import styles from "./style.module.scss";

const DocumentSettingsTypeSelector = ({
  selectedTabIndex,
  setSelectedTabIndex,
}) => {
  return (
    <div className={styles.selector} style={{ minWidth: `${32 * 2}px` }}>
      {/* <div
        onClick={() => setSelectedTabIndex(0)}
        className={`${styles.element} ${
          selectedTabIndex === 0 ? styles.active : ""
        }`}
      >
        <ImportExport
          style={{ transform: "rotate(45deg)" }}
          color={"primary"}
        />
      </div> */}
      <div
        onClick={() => setSelectedTabIndex(0)}
        className={`${styles.element} ${
          selectedTabIndex === 0 ? styles.active : ""
        }`}
      >
        <DescriptionOutlined />
      </div>

      <div
        onClick={() => setSelectedTabIndex(1)}
        className={`${styles.element} ${
          selectedTabIndex === 1 ? styles.active : ""
        }`}
      >
        <FileUploadOutlined />
      </div>
    </div>
  );
};

export default DocumentSettingsTypeSelector;
