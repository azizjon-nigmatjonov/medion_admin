import { generateGUID } from "../../../utils/generateID"
import { sortByOrder } from "../../../utils/sortByOrder"

export const computeSections = (sections) => {
  return sections
    ?.filter(section => !section.is_summary_section).map((section) => ({
      ...section,
      fields: section.fields?.map(field => ({...field, field_name: field.label}))
      .sort(sortByOrder) ?? [],
    }))
    .sort(sortByOrder) ?? []
}

export const computeSummarySection = (sections) => {
  const summarySection = sections?.find(section => section.is_summary_section)
  
  if(!summarySection) return {
    id: generateGUID(),
    label: 'Summary',
    fields: [],
    icon: '',
    order: 1,
    column: "SINGLE",
    is_summary_section: true
  }
  
  return {
    ...summarySection,
    fields: summarySection.fields?.map(field => ({...field, field_name: field.label}))
      .sort(sortByOrder) ?? []
  }
  
}

export const computeSectionsOnSubmit = (sections = [], summarySection = {}) => {
return [...sections, summarySection].map((section, sectionIndex) => ({
    ...section,
    order: sectionIndex + 1,
    fields: section.fields
  }))
}

export const computeViewRelations = (relations) => {
  return relations?.sort(sortByOrder)?.map(({relation, view_relation_type}) => ({
    relation_id: relation?.id,
    view_relation_type: view_relation_type
  }))?.filter(viewRelation => viewRelation?.relation_id) ?? []
}

export const computeViewRelationsOnSubmit = (relations) => {
  return relations.map((relation, relationIndex) => ({
    ...relation,
    order: relationIndex + 1,
  }))?.filter(el => el)
}