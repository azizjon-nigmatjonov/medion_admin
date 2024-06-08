import AddCircleOutlineIcon from "@mui/icons-material/Upload";
import { useState } from "react";
import { useRef } from "react";
import ImageViewer from "react-simple-image-viewer";
import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./Gallery/style.scss";
import fileService from "../../services/fileService";
import DownloadIcon from "@mui/icons-material/Download";

const FileUpload = ({
  value,
  onChange,
  className = "",
  disabled,
  tabIndex,
}) => {
  const inputRef = useRef("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageClickHandler = (index) => {
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService
      .upload(data)
      .then((res) => {
        onChange(import.meta.env.VITE_CDN_BASE_URL + "docs/" + res.filename);
      })
      .finally(() => setLoading(false));
  };

  const deleteImage = (id) => {
    onChange(null);
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
  };
  return (
    <div className={`Gallery ${className}`}>
      {value && (
        <div className="block" onClick={() => imageClickHandler()}>
          <button
            className="close-btn"
            type="button"
            onClick={(e) => closeButtonHandler(e)}
          >
            <CancelIcon />
          </button>
          <a
            href={value}
            className=""
            download
            target="_blank"
            rel="noreferrer"
          >
            <DownloadIcon
              style={{ width: "25px", height: "25px", fontSize: "30px" }}
            />
          </a>
        </div>
      )}

      {!value && (
        <div
          className="add-block block"
          onClick={() => inputRef.current.click()}
        >
          <div className="add-icon">
            {!loading ? (
              <>
                <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                {/* <p>Max size: 4 MB</p> */}
              </>
            ) : (
              <CircularProgress />
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            tabIndex={tabIndex}
            autoFocus={tabIndex === 1}
            onChange={inputChangeHandler}
            disabled={disabled}
          />
        </div>
      )}

      {previewVisible && ""}
    </div>
  );
};

export default FileUpload;
