import { Button } from '@mui/material'
import React from 'react'
import { FaRegComment } from 'react-icons/fa6'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { GrView } from 'react-icons/gr'

const CommentLike = ({
  view,
  isLiked,
  likes,
  comments,
  handleLikeButton,
  handleCommentButton,
}) => {
  return (
    <div className='flex items-center'>
      {view && (
        <div className='flex items-center gap-2 pr-2 ml-0.5'>
          <GrView />
          {view}
        </div>
      )}
      <Button
        variant='outlined'
        startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={handleLikeButton}
      >
        {likes}
      </Button>

      <Button
        variant='outlined'
        startIcon={<FaRegComment />}
        onClick={handleCommentButton}
      >
        {comments}
      </Button>
    </div>
  )
}

export default CommentLike
