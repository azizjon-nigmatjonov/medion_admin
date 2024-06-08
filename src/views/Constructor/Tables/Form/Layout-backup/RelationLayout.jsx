import LayoutRelationsBlock from "./LayoutRelationsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss";

const RelationLayout = ({ mainForm, layoutForm }) => {
  return (
    <div className={styles.page}>
      <SectionsBlock
        disableSection
        mainForm={mainForm}
        layoutForm={layoutForm}
      />
      <LayoutRelationsBlock mainForm={mainForm} />
    </div>
  );
};

export default RelationLayout;
