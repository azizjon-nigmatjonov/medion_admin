


import { useMemo } from "react"
import FormElementGenerator from "../../../../../../components/ElementGenerators/FormElementGenerator"
import styles from "./style.module.scss"


const CardAttributes = ({ control, columns }) => {

  const attributeSections = useMemo(() => (
    [
      {
        label: 'Card attributes',
        fields: [
          {
            label: 'Value field slug',
            slug: 'attributes.CARD.value_field_slug',
            type: "PICK_LIST",
            attributes: { options: columns }
          },
          {
            label: 'Label font size',
            slug: 'attributes.CARD.label_font_size',
            type: "NUMBER",
            defaultValue: 24
          },
          {
            label: 'Label color',
            slug: 'attributes.CARD.label_color',
            type: "COLOR",
            defaultValue: '#000000'
          },
          {
            label: 'Value font size',
            slug: 'attributes.CARD.value_font_size',
            type: "NUMBER",
            defaultValue: 30
          },
          
          {
            label: 'Value color',
            slug: 'attributes.CARD.value_color',
            type: "COLOR",
            defaultValue: '#000000'
          },

          {
            label: 'Background color',
            slug: 'attributes.CARD.background_color',
            type: "COLOR",
            defaultValue: '#ffffff'
          }
        ]
      },
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

export default CardAttributes
