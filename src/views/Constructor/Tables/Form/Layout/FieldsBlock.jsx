import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import { applyDrag } from "../../../../../utils/applyDrag";
import styles from "./style.module.scss";

const FieldsBlock = ({
  mainForm,
  layoutForm,
  selectedSettingsTab,
  setSelectedSettingsTab,
  closeSettingsBlock,
}) => {
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

  const sections = useWatch({
    control: mainForm.control,
    name: `sections`,
  });

  const summarySectionFields = useWatch({
    control: mainForm.control,
    name: "summary_section.fields",
  });

  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const viewRelations = useWatch({
    control: mainForm.control,
    name: "view_relations",
  });

  const usedFields = useMemo(() => {
    const list = [];

    sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        list.push(field.id);
      });
    });

    return list;
  }, [sections]);

  const usedSummarySectionFields = useMemo(() => {
    return summarySectionFields?.map((field) => field.id) ?? [];
  }, [summarySectionFields]);

  const unusedFields = useMemo(() => {
    return fields?.filter(
      (field) =>
        field.type !== "LOOKUP" &&
        field.type !== "LOOKUPS" &&
        field.type !== "DYNAMIC" &&
        (!usedFields.includes(field.id) ||
          !usedSummarySectionFields.includes(field.id))
    );
  }, [usedFields, fields, usedSummarySectionFields]);

  const unusedTableRelations = useMemo(() => {
    const fileRelation = { id: "", view_relation_type: "FILE", title: "Файл" };
    const relations = tableRelations ? [...tableRelations] : [fileRelation];

    return [...relations]?.filter((relation) => {
      if (relation.view_relation_type === "FILE") {
        return !viewRelations?.some(
          (viewRelation) => viewRelation.view_relation_type === "FILE"
        );
      } else {
        return !viewRelations?.some(
          (viewRelation) => viewRelation.relation_id === relation.id
        );
      }
    });
  }, [tableRelations, viewRelations]);
  const unusedRelations = useMemo(() => {
    return relations?.filter((relation) => !usedFields.includes(relation.id));
  }, [relations, usedFields]);

  const onDrop = (dropResult, colNumber) => {
    const result = applyDrag(fields, dropResult);
    if (!result) return;
  };

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>Add fields</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody}>
        <Tabs
          selectedIndex={selectedSettingsTab}
          onSelect={setSelectedSettingsTab}
        >
          <TabList>
            <Tab>Form fields</Tab>
            {/* <Tab>Input relation fields</Tab> */}
            <Tab>Table fields</Tab>
          </TabList>

          <TabPanel>
            <div className={styles.fieldsBlock}>
              <Container
                groupName="1"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => ({
                  ...unusedFields[i],
                  field_name: unusedFields[i]?.label ?? unusedFields[i]?.title,
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

              {!!unusedRelations?.length && (
                <div className={styles.settingsBlockHeader}>
                  <h2>Relation input fields</h2>
                </div>
              )}

              <Container
                groupName="1"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => ({
                  ...unusedRelations[i],
                  field_name:
                    unusedRelations[i]?.label ?? unusedFields[i]?.title,
                  relation_type: unusedRelations[i].type,
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
              </Container>
            </div>
          </TabPanel>

          <TabPanel>
            <div className={styles.fieldsBlock}>
              <Container
                groupName="table_relation"
                onDrop={onDrop}
                dropPlaceholder={{ className: "drag-row-drop-preview" }}
                getChildPayload={(i) => unusedTableRelations[i]}
              >
                {unusedTableRelations?.map((relation) => (
                  <Draggable
                    key={relation.id}
                    style={{ overflow: "visible", width: "fit-content" }}
                  >
                    <div
                      className={`${styles.sectionFieldRow} ${styles.relation}`}
                    >
                      {relation.title ??
                        relation[relation.relatedTableSlug]?.label}
                    </div>
                  </Draggable>
                ))}
              </Container>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default FieldsBlock;
