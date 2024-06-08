

export const arrayToOptions = (array) => {
  return array.map(item => ({
    value: item,
    label: item
  })) ?? []
}