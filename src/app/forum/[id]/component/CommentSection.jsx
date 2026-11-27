import { useEffect, useState } from 'react'
import CommentLike from './CommentLike'
import {
  deleteComment,
  insertReplyToComment,
  updateLikeToComment,
} from '../action'
import CommentField from './CommentField'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import Avatar from '@/components/Avatar'
import { postFormattedDate } from '@/utils/time'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'

const CommentSection = ({
  forumId,
  comments,
  user,
  fetchPost,
  fetchPostMoreComment,
  currentReplies = 0,
  maxReplies = 4,
}) => {
  const [likedComments, setLikedComments] = useState([])
  const [commentFieldStates, setCommentFieldStates] = useState({})
  const [newComments, setNewComments] = useState({})
  const [repliesVisibility, setRepliesVisibility] = useState({})
  const [maxRepliesCount, setMaxRepliesCount] = useState(maxReplies)
  const [openDelete, setOpenDelete] = useState(false)

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

  const handleCloseDeleteDialog = () => setOpenDelete(false)

  const handleDeleteButton = () => setOpenDelete(true)

  const handleAddComment = (commentId, value) => {
    try {
      if (value === '') {
        return toast.error({
          render() {
            return 'Comment fields cannot be empty!'
          },
          autoClose: 2000,
        })
      }

      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const newComment = await insertReplyToComment(commentId, user, value)

          if (newComment) {
            maxRepliesCount > 4 ? fetchPostMoreComment() : fetchPost()
            handleCancelComment(commentId)
            resolve(newComment)
          } else reject(newComment)
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Comment inserted successfully!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Failed to insert comment!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  console.log(forumId)

  const handleDeleteComment = (commentId) => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const deleted = await deleteComment(forumId, commentId)
          if (deleted) {
            maxRepliesCount > 4 ? fetchPostMoreComment() : fetchPost()
            setOpenDelete(false)
            resolve(deleted)
          } else reject(deleted)
        })
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Comment deleted successfully!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Failed to delete comment!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const toggleRepliesVisibility = (commentId) => {
    setRepliesVisibility((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }))
  }

  useEffect(() => {
    if (comments) {
      const likedByUser = comments
        .filter((comment) => comment.likedBy?.includes(user))
        .map((comment) => comment._id)
      setLikedComments(likedByUser)
    }
  }, [comments, user])

  return (
    <div className={currentReplies === 0 ? '-mt-2' : ''}>
      {comments &&
        comments.map((comment, index) => (
          <div
            key={index}
            className='w-full py-4 border-b last:border-b-0 border-line'
          >
            <div className='flex items-center gap-3'>
              <Avatar name={comment.studentId.fullName} size={32} />
              <p className='text-sm'>
                <span className='font-semibold'>{comment.studentId.fullName}</span>
                <span className='text-ink-3'> · {postFormattedDate(comment.createdAt)}</span>
              </p>
            </div>
            <div className='mt-1 ml-11'>
              <p className='mb-3 text-[15px] leading-relaxed'>{comment.content}</p>
              <CommentLike
                isLiked={likedComments.includes(comment._id)}
                likes={comment.likedBy?.length}
                comments={comment.replies?.length}
                handleLikeButton={() => handleLikeButton(comment._id)}
                handleCommentButton={() => handleCommentButton(comment._id)}
                handleDeleteButton={handleDeleteButton}
                currentUser={user}
                commentAuthor={comment.studentId.id}
              />
              <DeleteConfirmationDialog
                open={openDelete}
                message='comment'
                onCancel={handleCloseDeleteDialog}
                onConfirm={() => handleDeleteComment(comment._id)}
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
            </div>

            {comment.replies.length > 0 && (
              <>
                {currentReplies + 1 <= maxRepliesCount ? (
                  <Button size='small' sx={{ ml: 5, mt: 1 }} onClick={() => toggleRepliesVisibility(comment._id)}>
                    {repliesVisibility[comment._id]
                      ? 'Hide Replies'
                      : `View Replies (${comment.replies.length})`}
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      const post = await fetchPostMoreComment()
                      setMaxRepliesCount(maxRepliesCount + 1)
                      if (post) {
                        comment.content && toggleRepliesVisibility(comment._id)
                      }
                    }}
                  >
                    Show more comments
                  </Button>
                )}
                {repliesVisibility[comment._id] && (
                  <div className='pl-4 mt-2 border-l-2 ml-11 border-line'>
                    <CommentSection
                      forumId={forumId}
                      comments={comment.replies}
                      user={user}
                      fetchPost={fetchPost}
                      fetchPostMoreComment={fetchPostMoreComment}
                      currentReplies={currentReplies + 1}
                      maxReplies={maxRepliesCount}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
    </div>
  )
}

export default CommentSection
