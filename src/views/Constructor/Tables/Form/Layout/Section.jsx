import { Add, Delete } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import ButtonsPopover from "../../../../../components/ButtonsPopover";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import HFIconPicker from "../../../../../components/FormElements/HFIconPicker";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import { applyDrag } from "../../../../../utils/applyDrag";
import styles from "./style.module.scss";

const Section = ({
  mainForm,
  index,
  layoutForm,
  fieldsMap,
  openFieldSettingsBlock,
  sectionsFieldArray,
  openFieldsBlock,
  openRelationSettingsBlock,
}) => {
  const sectionFields = useFieldArray({
    control: mainForm.control,
    name: `sections.${index}.fields`,
    keyName: "key",
  });

  const openSettingsBlock = (field) => {
    if (!field.id?.includes("#")) {
      openFieldSettingsBlock(fieldsMap[field.id] ?? field);
      return;
    }

    const relationsMap = mainForm.getValues("relationsMap");
    const relationId = field.id.split("#")[1];

    const relation = relationsMap[relationId];

    openRelationSettingsBlock(relation);
  };

  const onDrop = (dropResult) => {
    const { fields, insert, move, remove } = sectionFields;

    const result = applyDrag(fields, dropResult);

    if (!result) return;
    if (result.length > fields.length) {
      insert(dropResult.addedIndex, { ...dropResult.payload });
    } else if (result.length < fields.length) {
      remove(dropResult.removedIndex);
    } else {
      move(dropResult.removedIndex, dropResult.addedIndex);
    }
  };

  const removeField = (index, colNumber) => {
    const { remove } = sectionFields;
    remove(index);
  };

  return (
    <Card className={`${styles.sectionCard}`}>
      <div className={styles.sectionCardHeader}>
        <div className={styles.sectionCardHeaderLeftSide}>
          <HFIconPicker
            control={mainForm.control}
            name={`sections[${index}].icon`}
            disabledHelperText
          />

          <HFTextField
            disabledHelperText
            placeholder="Label"
            control={mainForm.control}
            name={`sections[${index}].label`}
            size="small"
            style={{ width: 170 }}
          />
        </div>

        <div className="flex gap-1">
          <RectangleIconButton onClick={() => openFieldsBlock("FIELD")}>
            <Add />
          </RectangleIconButton>
          <RectangleIconButton
            color="error"
            onClick={() => sectionsFieldArray.remove(index)}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </div>

        {/* <SectionSettingsDropdown
          columnType={columnType}
          setColumnType={setColumnType}
          control={mainForm.control}
          onDelete={() => sectionsFieldArray.remove(index)}
        /> */}
      </div>

      <div className={styles.sectionCardBody}>
        <Container
          style={{ minHeight: 150, width: "100%" }}
          groupName="1"
          dragClass="drag-row"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
          onDrop={(dragResults) => onDrop(dragResults, 1)}
          getChildPayload={(index) => sectionFields.fields[index]}
        >
          {sectionFields?.fields?.map((field, fieldIndex) => (
            <Draggable key={field.key}>
              <div className={styles.sectionCardRow}>
                <FormElementGenerator
                  control={layoutForm.control}
                  field={fieldsMap[field.id] ?? field}
                  isLayout={true}
                  sectionIndex={index}
                  column={1}
                  fieldIndex={fieldIndex}
                  mainForm={mainForm}
                />
                <ButtonsPopover
                  className={styles.deleteButton}
                  onEditClick={() => openSettingsBlock(field)}
                  onDeleteClick={() => removeField(fieldIndex, 1)}
                />
                {/* <RectangleIconButton
                  className={styles.deleteButton}
                  color={"error"}
                  onClick={() => removeField(fieldIndex, 1)}
                >
                  <Delete color="error" />
                </RectangleIconButton>
                <RectangleIconButton
                  className={styles.deleteButton}
                  color={"primary"}
                  onClick={() => openFieldSettingsBlock(fieldsMap[field.id] ?? field)}
                >
                  <Settings color="primary" />
                </RectangleIconButton> */}
              </div>
            </Draggable>
          ))}
        </Container>
      </div>
    </Card>
  );
};

export default Section;
