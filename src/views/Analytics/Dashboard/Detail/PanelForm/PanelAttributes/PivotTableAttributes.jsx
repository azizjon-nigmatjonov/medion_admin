import { useMemo } from "react";
import FormElementGenerator from "../../../../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";

const BarChartAttributes = ({ control, columns }) => {
  const attributeSections = useMemo(
    () => [
      {
        label: "Pivot chart attributes",
        fields: [
          {
            label: "Key field slug",
            slug: "attributes.PIVOT_TABLE.label_field_slug",
            type: "PICK_LIST",
            attributes: { options: columns },
          },
          {
            label: "Value field slug",
            slug: "attributes.PIVOT_TABLE.value_field_slug",
            type: "PICK_LIST",
            attributes: { options: columns },
          },
          {
            label: "Key field slug2",
            slug: "attributes.PIVOT_TABLE.label_field_slug2",
            type: "PICK_LIST",
            attributes: { options: columns },
          },
          {
            label: "Value field slug2",
            slug: "attributes.PIVOT_TABLE.value_field_slug2",
            type: "PICK_LIST",
            attributes: { options: columns },
          },
        ],
      },
      // {
      //   label: "Bottom axis",
      //   fields: [
      //     {
      //       label: "Tick size",
      //       slug: "attributes.BAR_CHART.axisBottom.tickSize",
      //       type: "NUMBER",
      //       defaultValue: 5,
      //     },
      //     {
      //       label: "Tick padding",
      //       slug: "attributes.BAR_CHART.axisBottom.tickPadding",
      //       type: "NUMBER",
      //       defaultValue: 0,
      //     },
      //     {
      //       label: "Tick rotation",
      //       slug: "attributes.BAR_CHART.axisBottom.tickRotation",
      //       type: "NUMBER",
      //       defaultValue: 0,
      //     },
      //     {
      //       label: "Legend",
      //       slug: "attributes.BAR_CHART.axisBottom.legend",
      //     },
      //     {
      //       label: "Legend position",
      //       slug: "attributes.BAR_CHART.axisBottom.legendPosition",
      //       type: "PICK_LIST",
      //       attributes: {
      //         options: ["start", "middle", "end"],
      //       },
      //       defaultValue: "middle",
      //     },
      //     {
      //       label: "Legend offsett",
      //       slug: "attributes.BAR_CHART.axisBottom.legendOffset",
      //       type: "NUMBER",
      //       defaultValue: 32,
      //     },
      //   ],
      // },
      // {
      //   label: "Left axis",
      //   fields: [
      //     {
      //       label: "Tick size",
      //       slug: "attributes.BAR_CHART.axisLeft.tickSize",
      //       type: "NUMBER",
      //       defaultValue: 5,
      //     },
      //     {
      //       label: "Tick padding",
      //       slug: "attributes.BAR_CHART.axisLeft.tickPadding",
      //       type: "NUMBER",
      //       defaultValue: 0,
      //     },
      //     {
      //       label: "Tick rotation",
      //       slug: "attributes.BAR_CHART.axisLeft.tickRotation",
      //       type: "NUMBER",
      //       defaultValue: 0,
      //     },
      //     {
      //       label: "Legend",
      //       slug: "attributes.BAR_CHART.axisLeft.legend",
      //     },
      //     {
      //       label: "Legend position",
      //       slug: "attributes.BAR_CHART.axisLeft.legendPosition",
      //       type: "PICK_LIST",
      //       attributes: {
      //         options: ["start", "middle", "end"],
      //       },
      //       defaultValue: "middle",
      //     },
      //     {
      //       label: "Legend offsett",
      //       slug: "attributes.BAR_CHART.axisLeft.legendOffset",
      //       type: "NUMBER",
      //       defaultValue: -40,
      //     },
      //   ],
      // },
    ],
    [columns]
  );

  return (
    <>
      {attributeSections?.map((section, index) => (
        <>
          <div key={index} className={styles.settingsSectionHeader}>
            {section.label}
          </div>
          <div className="p-2">
            {section.fields?.map((field) => (
              <FormElementGenerator
                control={control}
                field={field}
                disabledPermissions
              />
            ))}
          </div>
        </>
      ))}
    </>
  );
};

export default BarChartAttributes;
