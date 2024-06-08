import { get } from "@ngard/tiny-get"



export const getFieldLabel = (field = {}, slug = "") => {

  if(!slug) return ""

  if(!slug.includes('#')) return get(field, slug)

  
  return slug.split('#')?.map(part => 
    get(field, part)
  ).join(' ') ?? ''
}