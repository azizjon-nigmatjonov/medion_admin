import { useEffect, useMemo, useRef, useState } from "react";
import Moveable from "react-moveable";
import { useParams } from "react-router-dom";
import useTabRouter from "../../../hooks/useTabRouter";
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel";
import styles from "./style.module.scss";
import "./moveable.scss";
import daysDifference from "../../../utils/daysDifference";
import constructorObjectService from "../../../services/constructorObjectService";

const DataBlock = ({ data, view, fieldsMap, computedDateList }) => {
  const ref = useRef();
  const { tableSlug } = useParams();
  const { navigateToForm } = useTabRouter();

  const [target, setTarget] = useState(null);
  const [frame] = useState({
    translate: [160, 160],
  });

  const viewFields = useMemo(() => {
    if (!data) return [];

    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [data, view, fieldsMap]);

  const navigateToEditPage = (data) => {
    navigateToForm(tableSlug, "EDIT", data);
  };

  const onResizeSubmit = (frame) => {
    const beginIndex = Math.floor((frame.translate[0] + 2) / 159);
    const endIndex = Math.ceil((frame.translate[0] + frame.width) / 159);

    constructorObjectService.update("hospital_stay", {
      data: {
        ...data[1],
        date_from: computedDateList[beginIndex],
        date_to: computedDateList[endIndex],
      },
    });
  };

  // ---------RESIZE ACTIONS------------
  const onResizeStart = (e) => {
    e.setOrigin(["%", "%"]);
    e.dragStart && e.dragStart.set(frame.translate);
  };
  const onResize = ({ target, width, drag }) => {
    const beforeTranslate = drag.beforeTranslate;
    if (beforeTranslate[0] < 0) return null;
    target.style.width = `${width}px`;
    target.style.transform = `translateX(${beforeTranslate[0]}px)`;
  };
  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate;
    }
    onResizeSubmit(lastEvent.drag);
  };

  useEffect(() => {
    if (!ref?.current) return null;
    setTarget(ref.current);
  }, [ref]);

  return (
    <div>
      <div
        ref={ref}
        className={styles.ganttFrame}
        onClick={() => navigateToEditPage(data[1])}
        style={{
          transform: `translateX(${
            159 * daysDifference(computedDateList[0], data[1]?.date_from)
          }px)`,
          width: `${
            159 * daysDifference(data[1]?.date_from, data[1]?.date_to)
          }px`,
        }}
      >
        {viewFields?.map((field) => (
          <div>
            {field.type === "LOOKUP"
              ? getRelationFieldTableCellLabel(
                  field,
                  data[1],
                  field.slug + "_data"
                )
              : data[1][field.slug]}
          </div>
        ))}
      </div>
      <Moveable
        className="moveable1"
        target={target}
        throttleResize={159}
        resizable
        keepRatio={false}
        origin={false}
        renderDirections={["w", "e"]}
        padding={{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
    </div>
  );
};

export default DataBlock;
