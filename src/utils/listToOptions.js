

const listToOptions = (list, labelFieldName = 'title', valueFieldName = 'id') => {
  return list?.map(el => ({ value: valueFieldName !== 'all' ? el[valueFieldName] : el, label: el[labelFieldName] })) ?? []
}

export default listToOptions