import { Add, Delete } from "@mui/icons-material"
import { Card, IconButton, Menu } from "@mui/material"
import { useMemo, useState } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Container, Draggable } from "react-smooth-dnd"
import { Tabs } from "react-tabs"
import HFAutoWidthInput from "../../../../../components/FormElements/HFAutoWidthInput"
import IconGenerator from "../../../../../components/IconPicker/IconGenerator"
import { applyDrag } from "../../../../../utils/applyDrag"
import { generateGUID } from "../../../../../utils/generateID"
import LayoutRelationTable from "./LayoutRelationTable"
import styles from "./style.module.scss"

const LayoutRelationsBlock = ({ mainForm }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { fields: viewRelations, ...viewRelationsFieldArray } = useFieldArray({
    control: mainForm.control,
    name: "view_relations",
    keyName: "key",
  })

  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  })

  const addNewViewRelation = (option) => {
    viewRelationsFieldArray.append({
      id: generateGUID(),
      label: option.label,
      is_editable: false,
      relation: {
        ...option.relation,
        table_from: option.relation.table_from.slug,
        table_to: option.relation.table_to.slug,
      },
      icon: option.icon,
    })
  }

  const removeViewRelation = (index) => {
    if(selectedTabIndex === index) {
      setSelectedTabIndex(0)
    }
    viewRelationsFieldArray.remove(index)
  }

  const options = useMemo(() => {
    return tableRelations?.map((relation) => ({
      value: relation.id,
      label: relation[relation.relatedTableSlug]?.label,
      icon: relation[relation.relatedTableSlug]?.icon,
      relation,
    }))
  }, [tableRelations])
  
  const onDrop = (dropResult) => {
    const result = applyDrag(viewRelations, dropResult)
    if(result) viewRelationsFieldArray.move(dropResult.removedIndex, dropResult.addedIndex)
  }

  return (
    <div className={styles.relationsBlock}>
      <Card>
        <Tabs>
          <div className={styles.cardHeader}>
            <div className={styles.tabList}>
              <Container orientation="horizontal" onDrop={onDrop} >
                {viewRelations.map((relation, index) => (
                  <Draggable key={relation.id} >
                    <div className={`${styles.tab} ${selectedTabIndex === index ? styles.active : ''}`}  onClick={() => setSelectedTabIndex(index)} >
                      <IconGenerator icon={relation.icon} />
                      <HFAutoWidthInput inputClassName={styles.tabLabelInput} control={mainForm.control} name={`view_relations[${index}].label`} />
                      <IconButton onClick={() => removeViewRelation(index)} ><Delete /></IconButton>
                    </div>
                  </Draggable>
                ))}
                </Container>
            </div>

            <RelationSelectButton
              options={options}
              onSelect={addNewViewRelation}
            />
          </div>


          <div className={styles.cardBody} >
            <LayoutRelationTable relation={viewRelations[selectedTabIndex]} mainForm={mainForm} index={selectedTabIndex} />
          </div>

        </Tabs>
      </Card>
    </div>
  )
}

const RelationSelectButton = ({ options = [], onSelect = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const rowClickHandler = (option) => {
    closeMenu()
    onSelect(option)
  }

  return (
    <div>
      <IconButton onClick={openMenu}>
        <Add />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        {options.map((option) => (
          <div
            key={option.id}
            className={styles.menuItem}
            onClick={() => rowClickHandler(option)}
          >
            <IconGenerator icon={option.icon} /> {option.label}
          </div>
        ))}
      </Menu>
    </div>
  )
}

export default LayoutRelationsBlock
