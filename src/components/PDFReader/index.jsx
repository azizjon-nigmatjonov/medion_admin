import { Dialog } from "@mui/material";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import RectangleIconButton from "../Buttons/RectangleIconButton";

export default function PDFReader({ value }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const close = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };
  return (
    <>
      <RectangleIconButton color='warning' onClick={open}>
        <RemoveRedEyeRoundedIcon color='warning' />
      </RectangleIconButton>

      <div>
        <Dialog
          fullScreen
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "90%",
            width: "60%",
          }}
        >
          <button
            onClick={(e) => close(e)}
            style={{
              padding: "5px",
              alignSelf: "flex-end",
              cursor: "pointer",
              border: "none",
            }}
          >
            <CancelIcon />
          </button>

          <object
            type='application/pdf'
            data={value}
            width='100%'
            height='100%'
          />
        </Dialog>
      </div>
    </>
  );
}
