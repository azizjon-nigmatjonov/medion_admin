

export const selectElementFromEndOfString = ({string = "", index = 1, separator = " "}) => {

  const elements = string.split(separator);
  
  return elements[elements.length - index];
}