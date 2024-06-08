import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from "@mui/icons-material/Add"
import SecondaryButton from './SecondaryButton';

const CreateButton = ({ children, title = "Добавить", type, ...props }) => {

  if(type === 'secondary') return <SecondaryButton {...props} >
    <AddIcon />
    {title}
  </SecondaryButton>

  return (
    <LoadingButton
      startIcon={<AddIcon />}
      variant="contained"
      loadingPosition="start"
      {...props}
    >
      {title}
    </LoadingButton>
  )
}

export default CreateButton
