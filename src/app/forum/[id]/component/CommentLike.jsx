import React from 'react'
import { LuHeart, LuMessageSquare, LuEye, LuTrash2 } from 'react-icons/lu'

const CommentLike = ({
  view,
  isLiked,
  likes,
  comments,
  handleLikeButton,
  handleCommentButton,
  handleDeleteButton,
  currentUser,
  commentAuthor,
}) => {
  const pill = 'flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-full border tnum'
  return (
    <div className='flex items-center gap-2'>
      <button onClick={handleLikeButton} aria-pressed={!!isLiked} aria-label={isLiked ? 'Unlike' : 'Like'}
        className={`${pill} ${isLiked ? 'bg-red-50 border-red-200 text-red-700' : 'border-line text-ink-2 hover:text-ink hover:bg-page'}`}>
        <LuHeart size={15} fill={isLiked ? 'currentColor' : 'none'} /> {likes ?? 0}
      </button>
      <button onClick={handleCommentButton} aria-label='Comment' className={`${pill} border-line text-ink-2 hover:text-ink hover:bg-page`}>
        <LuMessageSquare size={15} /> {comments ?? 0}
      </button>
      {view !== undefined && (
        <span className='flex items-center gap-1.5 ml-2 text-sm text-ink-3 tnum' title='Views'>
          <LuEye size={15} aria-hidden /> {view}<span className='sr-only'> views</span>
        </span>
      )}
      {currentUser === commentAuthor && handleDeleteButton && (
        <button onClick={handleDeleteButton} aria-label='Delete comment' className='grid ml-1 rounded-full size-8 place-items-center text-ink-3 hover:text-red-700 hover:bg-red-50'>
          <LuTrash2 size={15} />
        </button>
      )}
    </div>
  )
}

export default CommentLike
