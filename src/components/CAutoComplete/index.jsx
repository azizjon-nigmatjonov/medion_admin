import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import useDebounce from "../../hooks/useDebounce"

const CAutoComplete = ({ requestService, value, onChange, width, label, fieldName = 'users', params = {}, ...props }) => {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  
  const search = (_, searchText) => {
    updateOptions(searchText)
  }

  const updateOptions = useDebounce((searchText) => {
    
    setLoading(true)
    requestService({ search: searchText, ...params })
      .then((res) => setOptions(res[fieldName] ?? []))
      .finally(() => setLoading(false))
  }, 700)

  useEffect(() => {
    updateOptions()
  }, [])

  return (
    <Autocomplete
      value={value}
      style={{width, marginBottom: '20px'}}
      onChange={onChange}
      getOptionLabel={(option) => option.name ?? option.email ?? option.login ?? option.phone}
      options={options}
      loading={loading}
      onInputChange={search}
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="primary" size={25} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    ></Autocomplete>
  )
}

export default CAutoComplete
