import { useState } from "react";
import CascadingCollapse from "./CascadingCollapse";
import styles from "./style.module.scss";

const CascadingRecursiveBlock = ({
  fields,
  level = 1,
  cascading,
  setValue,
  handleClose,
}) => {
  return (
    <div className={styles.cascading_collapse}>
      {fields?.map((item) => (
        <CascadingCollapse
          key={item?.id}
          item={item}
          level={level}
          cascading={cascading}
          setValue={setValue}
          handleClose={handleClose}
        />
      ))}
    </div>
  );
};

export default CascadingRecursiveBlock;
