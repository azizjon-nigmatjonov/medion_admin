import { Add } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";

import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import ButtonsPopover from "../../../../../components/ButtonsPopover";
import IconGenerator from "../../../../../components/IconPicker/IconGenerator";
import { applyDrag } from "../../../../../utils/applyDrag";
import RelationTable from "../../../components/RelationTable";
import styles from "./style.module.scss";

const RelationsBlock = ({
  mainForm,
  openFieldsBlock,
  openRelationSettingsBlock,
}) => {
  const relationsMap = useWatch({
    control: mainForm.control,
    name: "relationsMap",
  });

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const { fields: viewRelations, ...viewRelationsFieldArray } = useFieldArray({
    control: mainForm.control,
    name: "view_relations",
    keyName: "key",
  });

  const computedViewRelations = useMemo(() => {
    return viewRelations
      ?.map((relation) => {
        if (relation.view_relation_type === "FILE") {
          return {
            relation,
            title: "Файл",
          };
        } else {
          return relationsMap[relation.relation_id];
        }
      })
      ?.filter((el) => el);
  }, [viewRelations, relationsMap]);

  const onDrop = (dropResult) => {
    const result = applyDrag(computedViewRelations, dropResult);
    if (result)
      if (result.length > computedViewRelations?.length) {
        viewRelationsFieldArray.insert(
          dropResult?.addedIndex,
          dropResult.payload.view_relation_type === "FILE"
            ? { ...dropResult.payload, relation_id: dropResult.payload?.id }
            : { relation_id: dropResult.payload?.id }
        );
      } else {
        // viewRelationsFieldArray.replace(result)
        viewRelationsFieldArray.move(
          dropResult.removedIndex,
          dropResult.addedIndex
        );
      }
  };

  const removeViewRelation = (index, relation) => {
    viewRelationsFieldArray.remove(index);
  };

  return (
    <div className={styles.relationsBlock}>
      <Card>
        <div className={styles.cardHeader}>
          <div className={styles.tabList}>
            <Container
              groupName='table_relation'
              dropPlaceholder={{ className: "drag-row-drop-preview" }}
              orientation='horizontal'
              onDrop={onDrop}
            >
              {computedViewRelations.map((relation, index) => (
                <Draggable key={relation.id}>
                  <div
                    className={`${styles.tab} ${
                      selectedTabIndex === index ? styles.active : ""
                    }`}
                    onClick={() => setSelectedTabIndex(index)}
                  >
                    <IconGenerator icon={relation.icon} />
                    {relation.title}
                    <ButtonsPopover
                      onEditClick={() => openRelationSettingsBlock(relation)}
                      onDeleteClick={() => removeViewRelation(index, relation)}
                    />
                  </div>
                </Draggable>
              ))}
            </Container>
            <RectangleIconButton onClick={() => openFieldsBlock("RELATION")}>
              <Add />
            </RectangleIconButton>
          </div>
        </div>

        <RelationTable
          key={computedViewRelations[selectedTabIndex]?.id}
          relation={computedViewRelations[selectedTabIndex]}
        />
      </Card>
    </div>
  );
};

export default RelationsBlock;
