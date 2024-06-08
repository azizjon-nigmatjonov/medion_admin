import { Search } from "@mui/icons-material"
import { InputAdornment, TextField } from "@mui/material"

const SearchInput = ({onChange, ...props}) => {
  return (
    <TextField
      size="small"
      placeholder="Search..."
      onChange={e => onChange(e.target.value)}
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment style={{ marginRight: 10 }} >
            <Search />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default SearchInput
