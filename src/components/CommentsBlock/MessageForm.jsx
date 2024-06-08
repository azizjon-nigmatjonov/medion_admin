import { IconButton, TextField } from "@mui/material";
import UserAvatar from "../UserAvatar";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const MessageForm = ({
  value,
  setValue,
  submitHandler,
  selectedComment,
  cancelEdit,
}) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <form onSubmit={submitHandler} className="MessageForm silver-right-border">
      <UserAvatar user={userInfo} />
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-input"
        fullWidth
        size="small"
        placeholder="Add a comment"
        inputRef={(input) => input && selectedComment && input.focus()}
      />

      {selectedComment ? (
        <>
          <IconButton color="primary" type="submit">
            <SaveIcon />
          </IconButton>

          <IconButton color="error" onClick={cancelEdit}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <IconButton color="primary" type="submit">
          <SendIcon />
        </IconButton>
      )}
    </form>
  );
};

export default MessageForm;
