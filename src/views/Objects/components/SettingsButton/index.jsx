import { Settings } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import OutsideClickHandler from "react-outside-click-handler";
import "./settingsButton.scss";

const SettingsButton = () => {
  const { tableSlug, appId } = useParams();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const tables = useSelector((state) => state.constructorTable.list);

  const tableInfo = useMemo(() => {
    return tables?.find((table) => table.slug === tableSlug);
  }, [tables, tableSlug]);

  const url = `/settings/constructor/apps/${appId}/objects/${tableInfo?.id}/${tableInfo?.slug}`;

  return (
    <div className="settingBtn">
      <RectangleIconButton
        color="white"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Settings />
      </RectangleIconButton>
      {open ? (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
          <div className="settingModal">
            <NavLink
              to={url}
              target={"_blank"}
              style={{
                color: "#303940",
              }}
            >
              <div className="modalItems">Object settings</div>
            </NavLink>
            <div className="modalItems" onClick={() => {
              setOpen(false)
              setViewOpen(true)
            }}>View settings</div>
          </div>
        </OutsideClickHandler>
      ) : null}

      {/* <ViewSettingsModal open={viewOpen} setOpen={setViewOpen}>

      </ViewSettingsModal> */}
    </div>
  );
};

export default SettingsButton;
