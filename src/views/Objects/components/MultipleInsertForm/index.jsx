import { Drawer } from "@mui/material";
import { useState } from "react";
import CreateButton from "../../../../components/Buttons/CreateButton";
import Form from "./Form";
import styles from "./style.module.scss";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import QueueIcon from "@mui/icons-material/Queue";

const MultipleInsertButton = ({ view, tableSlug, fieldsMap }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState();

  const openDrawer = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  if (!view?.multiple_insert) return null;

  return (
    <>
      <RectangleIconButton onClick={openDrawer}>
        <QueueIcon color="primary" />
      </RectangleIconButton>
      <Drawer
        open={drawerIsOpen}
        onClose={closeDrawer}
        anchor="right"
        classes={{ paperAnchorRight: styles.verticalDrawer }}
      >
        <Form
          view={view}
          tableSlug={tableSlug}
          fieldsMap={fieldsMap}
          onClose={closeDrawer}
        />
      </Drawer>
    </>
  );
};

export default MultipleInsertButton;
