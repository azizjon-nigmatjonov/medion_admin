import FieldsBlock from "./FieldsBlock";
import SectionsBlock from "./SectionsBlock";
import styles from "./style.module.scss";

const ObjectLayout = ({ usedFields, mainForm, layoutForm }) => {
  return (
    <div className={styles.page}>
      <FieldsBlock
        usedFields={usedFields}
        mainForm={mainForm}
        layoutForm={layoutForm}
      />
      <SectionsBlock mainForm={mainForm} layoutForm={layoutForm} />
    </div>
  );
};

export default ObjectLayout;
