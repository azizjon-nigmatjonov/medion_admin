import { get } from "@ngard/tiny-get"
import { format } from "date-fns"
import {numberWithSpaces} from "@/utils/formatNumbers";

export const getRelationFieldLabel = (field, option) => {
  if (!option) return ""
  let label = ""

  field.attributes?.view_fields?.forEach((el) => {
    let result = ""
    let res = ''

    switch (el?.type) {
      case "DATE":
        result = format(new Date(option[el?.slug]), "dd.MM.yyyy")
        break
      case "DATE_TIME":
        result = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
        break 
      case "NUMBER":
        result = numberWithSpaces(option[el?.slug])
        break
      case "LOOKUP":
        el?.deep_view_fields?.forEach((item) => {
          if (handleDeepFieldView(option, item?.path_slug)) {
            res = res + ' ' +  handleDeepFieldView(option, item?.path_slug)
          }
        })
        result = res
        break
      default:
        result = option[el?.slug]
        break
    }
    label += `${result ?? ""} `
  })

  return label
}

function handleDeepFieldView (option, path_slug) {
  const result = get(option, path_slug)
  return result
}


export const getRelationFieldTabsLabel = (field, option) => {
  if (!Array.isArray(field?.view_fields)) return ""

  let label = ""

  field?.view_fields?.forEach((el) => {
    let result = ""
    let res = ""

    switch (el?.type) {
      case "DATE":
        result = format(new Date(option[el?.slug]), "dd.MM.yyyy")
        break
      case "DATE_TIME":
        result = format(new Date(option[el?.slug]), "dd.MM.yyyy HH:mm")
        break
      case "NUMBER":
        result = numberWithSpaces(option[el?.slug])
        break
      case "LOOKUP":
        el?.deep_view_fields?.forEach((item) => {
          if (handleDeepFieldView(option, item?.path_slug)) {
            res = res + ' ' +  handleDeepFieldView(option, item?.path_slug)
          }
        })
        result = res
        break
      default:
        result = option[el?.slug]
        break
    }

    label += `${result ?? ""} `
  })

  return label
}

export const getRelationFieldTableCellLabel = (field, option, tableSlug) => {
  let label = ""

  field.view_fields?.forEach((el) => {
    let result = ""
    let res = ''

    const value = get(option, `${tableSlug}.${el?.slug}`)

    switch (el?.type) {
      case "DATE":
        result = value ? format(new Date(value), "dd.MM.yyyy") : ""
        break
      case "DATE_TIME":
        result = value ? format(new Date(value), "dd.MM.yyyy HH:mm") : ""
        break
      case "NUMBER":
        result = numberWithSpaces(value)
        break
      case "LOOKUP":
        el?.deep_view_fields?.forEach((item) => {
          if (handleDeepFieldView(option, item?.path_slug)) {
            res = res + ' ' +  handleDeepFieldView(option, item?.path_slug)
          }
        })
        result = res
        break
      default:
        result = value
        break
    }

    label += `${result ?? ""} `
  })

  return label
}

export const getLabelWithViewFields = (viewFields, option) => {
  let label = ""

  viewFields?.forEach((field) => {
    let result = ""
    const value = get(option, field.slug)

    if (field?.type === "DATE")
      result = value ? format(new Date(value), "dd.MM.yyyy") : ""
    else if (field?.type === "DATE_TIME")
      result = value ? format(new Date(value), "dd.MM.yyyy HH:mm") : ""
    else if (field?.type === "NUMBER")
        result = numberWithSpaces(value)
    else result = value

    label += `${result ?? ""} `
  })

  return label
}
