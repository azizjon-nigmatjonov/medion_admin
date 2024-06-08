

export const getWordsBetweenCurlies = (str) => {
  var results = [],
    re = /{([^}]+)}/g,
    text

  while ((text = re.exec(str))) {
    results.push(text[1])
  }
  return results
}
