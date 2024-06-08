import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import subtaskCommentService from "../../services/subtaskComment"
import generateID from "../../utils/generateID"
import Comment from "./Comment"
import MessageForm from "./MessageForm"
import "./style.scss"

const CommentsBlock = ({
  comments,
  loader,
  setComments,
  subtaskId,
  scrollBottomRightSide
}) => {
  const userInfo = useSelector((state) => state.auth.userInfo)

  const messagesAreaRef = useRef()
  const [selectedComment, setSelectedComment] = useState(null)
  const [counter, setCounter] = useState(0)

  const [messageText, setMessageText] = useState("")

  const addNewComment = (message) => {
    const id = generateID()

    setComments((prev) => [
      ...prev,
      {
        message,
        id,
        created_at: new Date(),
        creator_id: userInfo.id,
        creator_name: userInfo.name,
        creator_photo: userInfo.photo_url,
        loader: true,
      },
    ])



    subtaskCommentService
      .add({
        creator_id: userInfo.id,
        message: message,
        subtask_id: subtaskId,
      })
      .then((res) => {
        setComments((prev) =>
          prev.map((el) => {
            if (el.id !== id) return el
            return {
              ...el,
              id: res.id,
              loader: false,
            }
          })
        )
      })


  }

  const deleteComment = (id) => {
    setCommentLoader(id, true)

    subtaskCommentService
      .delete(subtaskId, id)
      .then((res) => setComments((prev) => prev.filter((el) => el.id !== id)))
      .catch(() => setCommentLoader(id, false))
  }

  const editComment = (selectedComment, message) => {
    const id = selectedComment.id

    setCommentLoader(id, true)

    const data = {
      ...selectedComment,
      subtask_id: subtaskId,
      message,
    }

    subtaskCommentService
      .update(data)
      .then((res) => {
        setComments((prev) =>
          prev.map((comment) => (comment?.id !== id ? comment : data))
        )
        setCounter((prev) => prev + 1)
      })
      .finally(() => setCommentLoader(id, false))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (selectedComment) {
      return editComment(selectedComment, messageText)
    }

    addNewComment(messageText)
    setMessageText("")
  }

  const cancelEdit = () => setSelectedComment(null)

  const setCommentLoader = (id, value) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== id) return comment
        return {
          ...comment,
          loader: value,
        }
      })
    )
  }

  useEffect(() => {
    setMessageText(selectedComment?.message ?? "")
  }, [selectedComment])

  useEffect(() => {
    cancelEdit()
  }, [counter])

  return (
    <div className="CommentsBlock">
      <div className="messages-area" ref={messagesAreaRef}>
        {comments?.map((comment) => (
          <Comment
            comment={comment}
            key={comment.id}
            deleteComment={deleteComment}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            scrollBottomRightSide={scrollBottomRightSide}
            userId={userInfo?.id}
          />
        ))}
      </div>

      <MessageForm
        value={messageText}
        setValue={setMessageText}
        submitHandler={submitHandler}
        selectedComment={selectedComment}
        cancelEdit={cancelEdit}
      />
    </div>
  )
}

export default CommentsBlock
