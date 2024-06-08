import { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import ObjectLayout from "./ObjectLayout"
import RelationLayout from "./RelationLayout"
import styles from "./style.module.scss"

const Layout = ({ mainForm }) => {
  const sections = useWatch({
    control: mainForm.control,
    name: `sections`,
  })

  const usedFields = useMemo(() => {
    const list = []

    sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        list.push(field.id)
      })
    })

    return list
  }, [sections])

  const layoutForm = useForm({ mode: "onChange" })

  return (
    <div>
      <Tabs>
        <div className={styles.layoutTabsBlock} >
          <TabList>
            <Tab>Objects</Tab>
            <Tab>Relations</Tab>
          </TabList>
        </div>
        
        <TabPanel>
          <ObjectLayout mainForm={mainForm} usedFields={usedFields} layoutForm={layoutForm} />
        </TabPanel>

        <TabPanel>
          <RelationLayout mainForm={mainForm} layoutForm={layoutForm} />
        </TabPanel>



        {/* <div className={styles.page}>
          <FieldsBlock
            usedFields={usedFields}
            mainForm={mainForm}
            layoutForm={layoutForm}
          />
          <SectionsBlock mainForm={mainForm} layoutForm={layoutForm} />
          <LayoutRelationsBlock mainForm={mainForm} />
        </div> */}
      </Tabs>
    </div>
  )
}

export default Layout
