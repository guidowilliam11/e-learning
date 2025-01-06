import { useEffect, useState } from 'react'
import CommentLike from './CommentLike'
import { insertReplyToComment, updateLikeToComment } from '../action'
import CommentField from './CommentField'
import { toast } from 'react-toastify'

const CommentSection = ({
  comments,
  user,
  fetchPost,
  currentReplies = 0,
  maxReplies = 4,
}) => {
  const [likedComments, setLikedComments] = useState([])
  const [commentFieldStates, setCommentFieldStates] = useState({})
  const [newComments, setNewComments] = useState({})

  const handleLikeButton = async (commentId) => {
    try {
      const commentLiked = await updateLikeToComment(commentId, user)
      if (commentLiked) {
        fetchPost()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const setIsFocused = (commentId, state) => {
    setCommentFieldStates((prevState) => ({
      ...prevState,
      [commentId]: state,
    }))
  }

  const handleChangeComment = (commentId, value) => {
    setNewComments((prevState) => ({
      ...prevState,
      [commentId]: value,
    }))
  }

  const handleCommentButton = (commentId) => {
    setCommentFieldStates((prevState) => ({
      ...prevState,
      [commentId]: true,
    }))
    setNewComments((prevState) => ({
      ...prevState,
      [commentId]: '',
    }))
  }

  const handleCancelComment = (commentId) => {
    setCommentFieldStates((prevState) => ({
      ...prevState,
      [commentId]: false,
    }))
    setNewComments((prevState) => ({
      ...prevState,
      [commentId]: '',
    }))
  }

  const handleAddComment = (commentId, value) => {
    try {
      if (value === '') {
        return toast.error('Comment fields cannot be empty!')
      }

      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const newComment = await insertReplyToComment(commentId, user, value)

          if (newComment) {
            fetchPost()
            handleCancelComment(commentId)
            resolve(newComment)
          } else reject(newComment)
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Comment insert success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Comment insert failed!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
      reject(error)
    }
  }

  useEffect(() => {
    if (comments) {
      const likedByUser = comments
        .filter((comment) => comment.likedBy?.includes(user))
        .map((comment) => comment._id)
      setLikedComments(likedByUser)
    }
  }, [comments, user])

  console.log(comments)

  if (currentReplies >= maxReplies) {
    return <div>Show more comments</div>
  }

  return (
    <div>
      {comments &&
        comments.map((comment) => (
          <div
            key={comment._id}
            className='w-full p-4 mt-2 text-black bg-gray-200 rounded-lg'
          >
            <div className='mb-2 font-bold'>{comment.studentId.fullName}</div>
            <p className='mb-4'>{comment.content}</p>
            <CommentLike
              isLiked={likedComments.includes(comment._id)}
              likes={comment.likedBy?.length}
              comments={comment.replies?.length}
              handleLikeButton={() => handleLikeButton(comment._id)}
              handleCommentButton={() => handleCommentButton(comment._id)}
            />

            {commentFieldStates[comment._id] && (
              <CommentField
                comment={newComments[comment._id] || ''}
                isFocused={commentFieldStates[comment._id]}
                setIsFocused={(state) => setIsFocused(comment._id, state)}
                handleChangeComment={(e) =>
                  handleChangeComment(comment._id, e.target.value)
                }
                handleCancelComment={() => handleCancelComment(comment._id)}
                handleAddComment={() =>
                  handleAddComment(comment._id, newComments[comment._id])
                }
              />
            )}

            {comment.replies && (
              <div className='ml-5'>
                <CommentSection
                  comments={comment.replies}
                  user={user}
                  fetchPost={fetchPost}
                  currentReplies={currentReplies + 1}
                  maxReplies={5}
                />
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default CommentSection
