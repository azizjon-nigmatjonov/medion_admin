import { useState } from "react";
import { useMutation } from "react-query";
import CMultipleSelect from "../../../components/CMultipleSelect";
import objectDocumentService from "../../../services/objectDocumentService";

const FileTagSelect = ({ tags = [], row }) => {
  const [value, setValue] = useState(tags)

  const onSelectHandler = (e) => {
    const computedValue = e.target.value
    setValue(computedValue ?? [])
    updateTagsMutation(computedValue)
  }

  const { mutate: updateTagsMutation, isLoading: updateLoading } = useMutation(
    (computedValue) => objectDocumentService.update({
        ...row,
        tags: computedValue
    }),
  )

  return (
    <CMultipleSelect
      disabledHelperText
      options={[
        {label: 'Консультация', value: 'consultation'},
        {label: 'Диагностика', value: 'diagnostic'}
      ]}
      value={value}
      onChange={onSelectHandler}
    />
  );
}
 
export default FileTagSelect
