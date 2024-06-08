import { useMemo } from "react"
import FormElementGenerator from "../../../../../../components/ElementGenerators/FormElementGenerator"
import styles from "./style.module.scss"




const LineChartAttributes = ({ control, columns }) => {

  const attributeSections = useMemo(() => (
    [
      // {
      //   label: 'Line chart attributes',
      //   fields: [
      //     {
      //       label: 'Key field slug',
      //       slug: 'attributes.LINE_CHART.label_field_slug',
      //       type: "PICK_LIST",
      //       attributes: { options: columns }
      //     },
      //     {
      //       label: 'Value field slug',
      //       slug: 'attributes.LINE_CHART.value_field_slug',
      //       type: "PICK_LIST",
      //       attributes: { options: columns }
      //     }
      //   ]
      // },
      {
        label: 'Bottom axis',
        fields: [
          {
            label: 'Tick size',
            slug: 'attributes.LINE_CHART.axisBottom.tickSize',
            type: "NUMBER",
            defaultValue: 5
          },
          {
            label: 'Tick padding',
            slug: 'attributes.LINE_CHART.axisBottom.tickPadding',
            type: "NUMBER",
            defaultValue: 0
          },
          {
            label: 'Tick rotation',
            slug: 'attributes.LINE_CHART.axisBottom.tickRotation',
            type: "NUMBER",
            defaultValue: 0
          },
          {
            label: 'Legend',
            slug: 'attributes.LINE_CHART.axisBottom.legend',
          },
          {
            label: 'Legend position',
            slug: 'attributes.LINE_CHART.axisBottom.legendPosition',
            type: "PICK_LIST",
            attributes: {
              options: ['start', 'middle', 'end']
            },
            defaultValue: 'middle'
          },
          {
            label: 'Legend offsett',
            slug: 'attributes.LINE_CHART.axisBottom.legendOffset',
            type: "NUMBER",
            defaultValue: 32
          }
        ]
      },
      {
        label: 'Left axis',
        fields: [
          {
            label: 'Tick size',
            slug: 'attributes.LINE_CHART.axisLeft.tickSize',
            type: "NUMBER",
            defaultValue: 5
          },
          {
            label: 'Tick padding',
            slug: 'attributes.LINE_CHART.axisLeft.tickPadding',
            type: "NUMBER",
            defaultValue: 0
          },
          {
            label: 'Tick rotation',
            slug: 'attributes.LINE_CHART.axisLeft.tickRotation',
            type: "NUMBER",
            defaultValue: 0
          },
          {
            label: 'Legend',
            slug: 'attributes.LINE_CHART.axisLeft.legend',
          },
          {
            label: 'Legend position',
            slug: 'attributes.LINE_CHART.axisLeft.legendPosition',
            type: "PICK_LIST",
            attributes: {
              options: ['start', 'middle', 'end']
            },
            defaultValue: 'middle'
          },
          {
            label: 'Legend offsett',
            slug: 'attributes.LINE_CHART.axisLeft.legendOffset',
            type: "NUMBER",
            defaultValue: -40
          }
        ]
      }
    ]
  ), [ columns ])



  return (
    <>

      {
        attributeSections?.map((section, index) => (
          <>
             <div key={index} className={styles.settingsSectionHeader}>{section.label}</div>
             <div className="p-2">
              {
                section.fields?.map(field => (
                  <FormElementGenerator control={control} field={field} disabledPermissions />
                ))
              }
             </div>
          </>
        ))
      }
    </>
  )
}

export default LineChartAttributes
