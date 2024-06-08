// export const fieldTypes = [
//   "SINGLE_LINE",
//   "MULTI_LINE",
//   "EMAIL",
//   "PHONE",
//   "PICK_LIST",
//   "MULTISELECT",
//   "DATE",
//   "DATE_TIME",
//   "NUMBER",
//   "CURRENCY",
//   "DECIMAL",
//   "PERCENT",
//   "CHECKBOX",
//   "URL",
//   "FORMULA",
//   "LOOKUP",
// "PHOTO"
// ]

export const fieldTypes = [
  "SINGLE_LINE",
  "MULTI_LINE",
  "PICK_LIST",
  "DATE",
  "TIME",
  "DATE_TIME",
  "NUMBER",
  "CHECKBOX",
  "EMAIL",
  "MULTISELECT",
  "SWITCH",
  "PHOTO",
  "PHONE",
  "ICON",
  "PASSWORD",
  "FORMULA",
  "DENTIST",
  "STRING",
  "PDF_READER",
];

export const fieldTypesOptions = [
  {
    label: "Text",
    options: [
      {
        icon: "minus.svg",
        label: "Single line",
        value: "SINGLE_LINE",
      },
      {
        icon: "grip-lines.svg",
        label: "Multi line",
        value: "MULTI_LINE",
      },
    ],
  },
  {
    label: "Date",
    options: [
      {
        icon: "calendar.svg",
        label: "Date",
        value: "DATE",
      },
      {
        icon: "clock.svg",
        label: "Time",
        value: "TIME",
      },
      {
        icon: "business-time.svg",
        label: "Date time",
        value: "DATE_TIME",
      },
    ],
  },
  {
    label: "Number",
    options: [
      {
        icon: "hashtag.svg",
        label: "Number",
        value: "NUMBER",
      },
    ],
  },
  {
    label: "Input",
    options: [
      {
        icon: "square-check.svg",
        label: "Checkbox",
        value: "CHECKBOX",
      },
      {
        icon: "toggle-on.svg",
        label: "Switch",
        value: "SWITCH",
      },
    ],
  },
  {
    label: "Select",
    options: [
      // {
      //   label: "Picklist",
      //   value: "PICK_LIST"
      // },
      {
        icon: "list-check.svg",
        label: "Multi select",
        value: "MULTISELECT",
      },
    ],
  },
  {
    label: "File",
    options: [
      {
        icon: "image.svg",
        label: "Photo",
        value: "PHOTO",
      },
      {
        icon: "video.svg",
        label: "Video",
        value: "VIDEO",
      },
      {
        icon: "file.svg",
        label: "File",
        value: "FILE",
      },
    ],
  },
  {
    label: "Formula",
    options: [
      {
        icon: "square-root-variable.svg",
        label: "Formula in frontend",
        value: "FORMULA_FRONTEND",
      },
      {
        icon: "plus-minus.svg",
        label: "Formula in backend",
        value: "FORMULA",
      },
    ],
  },
  {
    label: "Other",
    options: [
      {
        icon: "arrow-up-9-1.svg",
        label: "Increment ID",
        value: "INCREMENT_ID",
      },
      {
        icon: "arrow-up-9-1.svg",
        label: "Select by switch",
        value: "SELECT_BY_SWITCH",
      },
      {
        icon: "arrow-up-a-z.svg",
        label: "Increment number",
        value: "INCREMENT_NUMBER",
      },
      {
        icon: "phone.svg",
        label: "Phone",
        value: "PHONE",
      },
      {
        icon: "envelope.svg",
        label: "Email",
        value: "EMAIL",
      },
      {
        icon: "icons.svg",
        label: "Icon",
        value: "ICON",
      },
      {
        icon: "lock.svg",
        label: "Password",
        value: "PASSWORD",
      },
      {
        icon: "barcode.svg",
        label: "Barcode",
        value: "BARCODE",
      },
      {
        icon: "barcode.svg",
        label: "Codabar",
        value: "CODABAR",
      },
      {
        icon: "fill.svg",
        label: "Autofill",
        value: "AUTOFILL",
      },
      {
        icon: "teeth.svg",
        label: "Dentist",
        value: "DENTIST",
      },
      {
        icon: "teeth.svg",
        label: "Pdf reader",
        value: "PDF_READER",
      },
    ],
  },
];
