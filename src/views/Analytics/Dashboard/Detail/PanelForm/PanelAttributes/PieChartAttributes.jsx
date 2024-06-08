import { useMemo } from "react"
import FormElementGenerator from "../../../../../../components/ElementGenerators/FormElementGenerator"
import styles from "./style.module.scss"

const PieChartAttributes = ({ control, columns }) => {
  const attributeSections = useMemo(
    () => [
      {
        label: "Pie chart attributes",
        fields: [
          {
            label: "Key field slug",
            slug: "attributes.PIE_CHART.label_field_slug",
            type: "PICK_LIST",
            attributes: { options: columns },
          },
          {
            label: "Value field slug",
            slug: "attributes.PIE_CHART.value_field_slug",
            type: "PICK_LIST",
            attributes: { options: columns },
          },
          {
            label: "Inner radius",
            slug: "attributes.PIE_CHART.innerRadius",
            type: "NUMBER",
            defaultValue: 0.5,
          },
          {
            label: "Pad angle",
            slug: "attributes.PIE_CHART.padAngle",
            type: "NUMBER",
            defaultValue: 0.7,
          },
          {
            label: "Corner radius",
            slug: "attributes.PIE_CHART.cornerRadius",
            type: "NUMBER",
            defaultValue: 3,
          },
          {
            label: "Border width",
            slug: "attributes.PIE_CHART.borderWidth",
            type: "NUMBER",
            defaultValue: 1,
          },
        ],
      },
    ],
    [columns]
  )

  return (
    <>
      {attributeSections?.map((section, index) => (
        <>
          <div key={index} className={styles.settingsSectionHeader}>
            {section.label}
          </div>
          <div className="p-2">
            {section.fields?.map((field) => (
              <FormElementGenerator control={control} field={field} disabledPermissions />
            ))}
          </div>
        </>
      ))}
    </>
  )
}

export default PieChartAttributes
