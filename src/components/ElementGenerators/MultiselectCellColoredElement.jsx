import { useMemo } from "react";
import IconGenerator from "../IconPicker/IconGenerator";

const MultiselectCellColoredElement = ({
  field,
  value = [],
  style,
  resize,
  ...props
}) => {
  const tags = useMemo(() => {
    if (typeof value === "string")
      return [
        {
          value,
        },
      ];
    return value
      ?.map((tagValue) =>
        field.attributes?.options?.find((option) => option.value === tagValue)
      )
      ?.filter((el) => el);
  }, [value, field?.attributes?.options]);

  const hasColor = field?.attributes?.has_color;
  const hasIcon = field?.attributes?.has_icon;

  if (!value?.length) return "";
  return (
    <div className="flex align-center gap-1" style={{ flexWrap: "wrap" }}>
      {tags?.map((tag) => (
        <div
          style={{
            color: hasColor ? tag.color : "#000",
            backgroundColor: hasColor ? tag.color + 33 : "#c0c0c039",
            padding: resize ? "0px 5px" : "5px 12px",
            width: "fit-content",
            borderRadius: 6,
            display: "flex",
            ...style,
          }}
          {...props}
        >
          {hasIcon && (
            <IconGenerator
              icon={tag.icon}
              size={14}
              className="mr-1"
              style={{ transform: "translateY(2px)" }}
            />
          )}

          {tag.label ?? tag.value}
        </div>
      ))}
    </div>
  );
};

export default MultiselectCellColoredElement;
