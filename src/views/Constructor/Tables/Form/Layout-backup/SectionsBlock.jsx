import { Add } from "@mui/icons-material";
import { Card } from "@mui/material";
import { Draggable, Container } from "react-smooth-dnd";
import { useFieldArray, useWatch } from "react-hook-form";
import styles from "./style.module.scss";
import Section from "./Section";
import { applyDrag } from "../../../../../utils/applyDrag";
import { generateGUID } from "../../../../../utils/generateID";
import { useMemo } from "react";

const SectionsBlock = ({ mainForm, layoutForm, disableSection }) => {
  const { fields: sections, ...sectionsFieldArray } = useFieldArray({
    control: mainForm.control,
    name: "sections",
    keyName: "key",
  });

  const addNewSection = () => {
    sectionsFieldArray.append({
      column: "SINGLE",
      fields: [],
      column1: [],
      column2: [],
      label: "",
      order: sections.length,
      id: generateGUID(),
    });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(sections, dropResult);

    if (result) {
      sectionsFieldArray.move(dropResult.removedIndex, dropResult.addedIndex);
      sectionsFieldArray.replace(result);
    }
  };

  const fieldsList = useWatch({
    control: mainForm.control,
    name: `fields`,
  });

  const fieldsMap = useMemo(() => {
    const map = {};

    fieldsList.forEach((field) => {
      map[field.id] = field;
    });
    return map;
  }, [fieldsList]);

  return (
    <div className={styles.sectionsBlock}>
      {!!sections.length && (
        <Container
          lockAxis="y"
          onDrop={onDrop}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {sections.map((section, index) => (
            <Draggable key={section.id}>
              <Section
                key={section.id}
                index={index}
                mainForm={mainForm}
                sectionsFieldArray={sectionsFieldArray}
                layoutForm={layoutForm}
                fieldsMap={fieldsMap}
                disableSection={disableSection}
              />
            </Draggable>
          ))}
        </Container>
      )}

      <Card className={styles.sectionCreateCard}>
        <div className={styles.sectionCreateButton} onClick={addNewSection}>
          <Add color="primary" />
          <p>Add section</p>
        </div>
      </Card>
    </div>
  );
};

export default SectionsBlock;
