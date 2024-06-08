import { sortByOrder } from "./sortByOrder";


export const addOrderNumberToSections = (sections = []) => {
  const sectionsWithOrderNumber = sections.map((section, index) => ({
    ...section,
    order: index + 1,
    fields: section.fields?.map((field, fieldIndex) => ({
      ...field,
      order: fieldIndex + 1,
    })) ?? []
  })) ?? [];

  return sectionsWithOrderNumber;
}

export const sortSections = (sections = []) => {

  const sortedSections = sections.sort(sortByOrder).map(section => ({
    ...section,
    fields: section.fields?.sort(sortByOrder) ?? []
  })) ?? []

  return sortedSections

}