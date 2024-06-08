import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Close, Add } from "@mui/icons-material";
import "./settingsButton.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  minHeight: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "6px",
  boxShadow: 24,
};

const leftSide = [
  {
    id: 1,
    title: "Table",
    icon: "",
  },
  {
    id: 2,
    title: "Board",
    icon: "",
  },
  {
    id: 3,
    title: "Calendar",
    icon: "",
  },
  {
    id: 4,
    title: "Gantt",
    icon: "",
  },
  {
    id: 5,
    title: "Tree",
    icon: "",
  },
];

export default function ViewSettingsModal({ open, setOpen, children }) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modalHeader">
            <div className="title">View settings</div>
            <Close />
          </div>
          <div className="modalBody">
            <div className="left">
              {leftSide.map((item) => (
                <div key={item?.id} className="viewOptions">
                  <div className="viewTitle">{item?.title}</div>
                </div>
              ))}
              <div className="addViewOption">
                <Add sx={{color: '#6E8BB7'}} />
              </div>
            </div>
            <div className="right"></div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
