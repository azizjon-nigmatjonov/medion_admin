import { Card, Collapse, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import styles from "./style.module.scss";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import { applyDrag } from "../../../../../utils/applyDrag";
import { useMemo, useState } from "react";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {
  KeyboardArrowDown,
  KeyboardDoubleArrowLeft,
} from "@mui/icons-material";

const FieldsBlock = ({ mainForm, layoutForm, usedFields }) => {
  const [blockIsOpen, setBlockIsOpen] = useState(true);

  const { fields } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "layoutRelations",
    keyName: "key",
  });

  const unusedFields = useMemo(() => {
    return fields?.filter(
      (field) =>
        field.type !== "LOOKUP" &&
        field.type !== "LOOKUPS" &&
        !usedFields.includes(field.id)
    );
  }, [usedFields, fields]);

  const unusedRelations = useMemo(() => {
    return relations?.filter((relation) => !usedFields.includes(relation.id));
  }, [relations, usedFields]);

  const onDrop = (dropResult, colNumber) => {
    const result = applyDrag(fields, dropResult);

    if (!result) return;
  };

  return (
    <div>
      {!blockIsOpen && (
        <Card
          className={styles.collapseBlock}
          onClick={() => setBlockIsOpen(true)}
        >
          <div className={styles.collapseButton}>
            {" "}
            Fields <KeyboardArrowDown />{" "}
          </div>
        </Card>
      )}

      <Collapse unmountOnExit orientation="horizontal" in={blockIsOpen}>
        <div className={styles.fieldsBlock}>
          <Card className={styles.fieldCard}>
            <div className={styles.fieldCardHeader}>
              <Typography variant="h4">Fields</Typography>

              <RectangleIconButton onClick={() => setBlockIsOpen(false)}>
                <KeyboardDoubleArrowLeft />
              </RectangleIconButton>
            </div>

            <div className={styles.fieldsWrapperBlock}>
              <Container
                groupName="1"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => ({
                  ...unusedFields[i],
                  field_name: unusedFields[i]?.label,
                })}
              >
                {unusedFields?.map((field, index) => (
                  <Draggable key={field.id} style={{ overflow: "visible" }}>
                    <div className={styles.sectionFieldRow}>
                      <FormElementGenerator
                        field={field}
                        control={layoutForm.control}
                        disabledHelperText
                      />
                    </div>
                  </Draggable>
                ))}
              </Container>
            </div>
          </Card>

          <Card className={styles.fieldCard}>
            <div className={styles.fieldCardHeader}>
              <Typography variant="h4">Relation fields</Typography>
            </div>

            <div className={styles.fieldsWrapperBlock}>
              <Container
                groupName="1"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => ({
                  ...unusedRelations[i],
                  field_name:
                    unusedRelations[i]?.label ?? unusedRelations[i]?.title,
                })}
              >
                {unusedRelations?.map((relation) => (
                  <Draggable key={relation.id} style={{ overflow: "visible" }}>
                    <div className={styles.sectionFieldRow}>
                      <FormElementGenerator
                        field={relation}
                        control={layoutForm.control}
                        disabledHelperText
                      />
                    </div>
                  </Draggable>
                ))}

                {/* {relation.fields?.map((field, index) => (
                <Draggable key={field.id} style={{ overflow: "visible" }}>
                  <div className={styles.sectionFieldRow}>
                    <FormElementGenerator
                      field={field}
                      control={layoutForm.control}
                      disabledHelperText
                    />
                  </div>
                </Draggable>
              ))} */}
              </Container>
            </div>
          </Card>
        </div>
      </Collapse>
    </div>
  );
};

export default FieldsBlock;
