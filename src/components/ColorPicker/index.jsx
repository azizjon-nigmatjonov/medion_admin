import "./style.scss"
import { Card, CircularProgress, IconButton, Popover } from "@mui/material"
import { colorList } from "./colorList"
import { useState } from "react"

const ColorPicker = ({ value, onChange, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl);

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} />
      </IconButton>
    )

    return (
      <div className="ColorPicker" onClick={(e) => e.stopPropagation()}>
        <div
          className="round"
          style={{ backgroundColor: value ?? "#fff" }}
          onClick={handleClick}
        ></div>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Card elevation={12} className="ColorPickerPopup">
            {colorList.map((color, index) => (
              <div
                className="round"
                key={index}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color)
                  handleClose()
                }}
              />
            ))}
          </Card>
        </Popover>
      </div>
    )

  // return (
  //   <PopupState variant="popover">
  //     {(popupState) => (
  //       <div className="ColorPicker" onClick={(e) => e.stopPropagation()}>
  //         <div
  //           className="round"
  //           style={{ backgroundColor: value ?? "#fff" }}
  //           {...bindTrigger(popupState)}
  //         ></div>
  //         <Popover
  //           {...bindPopover(popupState)}
  //           anchorOrigin={{
  //             vertical: "bottom",
  //             horizontal: "left",
  //           }}
  //           transformOrigin={{
  //             vertical: "top",
  //             horizontal: "left",
  //           }}
  //         >
  //           <Card elevation={12} className="ColorPickerPopup">
  //             {colorList.map((color, index) => (
  //               <div
  //                 className="round"
  //                 key={index}
  //                 style={{ backgroundColor: color }}
  //                 onClick={() => onChange(color)}
  //               />
  //             ))}
  //           </Card>
  //         </Popover>
  //       </div>
  //     )}
  //   </PopupState>
  // )
}

export default ColorPicker
