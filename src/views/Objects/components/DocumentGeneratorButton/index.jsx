import { Add, FileOpen } from "@mui/icons-material";
import { Menu, Tooltip } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import constructorObjectService from "../../../../services/constructorObjectService";
import { generateGUID } from "../../../../utils/generateID";
import styles from "./style.module.scss";
import UploadFileIcon from '@mui/icons-material/UploadFile';
const DocumentGeneratorButton = () => {
  const navigate = useNavigate();
  const { appId, tableSlug, id: objectId } = useParams();

  const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
  const userId = useSelector((state) => state.auth.userId);

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const {
    data: { templates, templateFields } = { templates: [], templateFields: [] },
  } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      const data = {
        table_slug: tableSlug,
      };

      data[`${loginTableSlug}_ids`] = [userId];

      return constructorObjectService.getList("template", {
        data,
      });
    },
    {
      select: ({ data }) => {
        const templates = data?.response ?? [];
        const templateFields = data?.fields ?? [];

        return {
          templates,
          templateFields,
        };
      },
    }
  );

  const navigateToDocumentEditPage = (template) => {
    const state = {
      toDocsTab: true,
      template: template,
      objectId,
    };

    closeMenu();
    navigate(`/main/${appId}/object/${tableSlug}`, { state });
  };

  const navigateToDocumentCreatePage = () => {
    const state = {
      toDocsTab: true,
      objectId,
      template: {
        id: generateGUID(),
        title: "NEW",
        type: "CREATE",
        table_slug: tableSlug,
        html: "",
      },
    };
    closeMenu();
    navigate(`/main/${appId}/object/${tableSlug}`, { state });
  };

  return (
    <>
      <Tooltip title="Generate document">
        <RectangleIconButton color="white" onClick={openMenu}>
          <UploadFileIcon color="primary"/>
        </RectangleIconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {templates?.map((template, index) => (
            <div
              key={template.id}
              className={`${styles.menuItem}`}
              onClick={() => navigateToDocumentEditPage(template)}
            >
              <p className={styles.itemText}>{template.title}</p>
            </div>
          ))}
          <div
            className={`${styles.menuItem}`}
            onClick={() => navigateToDocumentCreatePage()}
          >
            <Add color="primary" />
            <p className={styles.itemText}> Create new</p>
          </div>
        </div>
      </Menu>
    </>
  );
};

export default DocumentGeneratorButton;
