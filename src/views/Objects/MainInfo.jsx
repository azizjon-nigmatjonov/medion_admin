import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import FormCard from "./components/FormCard";
import styles from "./style.module.scss";
import { Tooltip } from "@mui/material";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";

const MainInfo = ({ computedSections, control, setFormValue }) => {
  const { tableSlug } = useParams();
  const [isShow, setIsShow] = useState(true);
  const fieldsList = useMemo(() => {
    const fields = [];

    computedSections?.forEach((section) => {
      section.fields?.forEach((field) => {
        fields.push(field);
      });
    });
    return fields;
  }, [computedSections]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isShow && (
          <button onClick={() => setIsShow((prev) => !prev)}>
            <KeyboardTabIcon style={{ color: "#000" }} />
          </button>
        )}
      </div>

      {isShow ? (
        <div className={styles.mainCardSide}>
          {computedSections.map((section) => (
            <FormCard
              key={section.id}
              title={section.label}
              className={styles.formCard}
              icon={section.icon}
            >
              <div className={styles.formColumn}>
                {section.fields?.map((field) => (
                  <FormElementGenerator
                    key={field.id}
                    field={field}
                    control={control}
                    setFormValue={setFormValue}
                    fieldsList={fieldsList}
                    formTableSlug={tableSlug}
                  />
                ))}
              </div>
            </FormCard>
          ))}
        </div>
      ) : (
        <div className={styles.hideSideCard}>
          <Tooltip title="Открыть полю ввода" placement="right" followCursor>
            <button onClick={() => setIsShow(true)}>
              <KeyboardTabIcon style={{ color: "#000" }} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default MainInfo;
