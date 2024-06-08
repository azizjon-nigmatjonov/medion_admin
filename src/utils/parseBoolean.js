const falsy = /^(?:f(?:alse)?|no?|0+)$/i;

export const parseBoolean = (val) => { 
  return !falsy.test(val) && !!val;
};