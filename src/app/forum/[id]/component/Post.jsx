'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { Button, TextField } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { fetchForumPost, updateLikeToPost } from '../action'
import { FaRegComment } from 'react-icons/fa6'

const Post = ({ id, user }) => {
  const [currentPost, setCurrentPost] = useState({})
  const [comment, setComment] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const fetchCurrentPost = async () => {
    try {
      const post = await fetchForumPost(id)

      if (post) {
        setCurrentPost(post)
        if (post.likedBy.includes(user)) {
          setIsLiked(true)
        } else setIsLiked(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLikeButton = async () => {
    try {
      const like = await updateLikeToPost(currentPost._id, user)

      if (like) {
        fetchCurrentPost()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCommentButton = () => {
    const comment = document.getElementById('comment')
    if (comment) {
      comment.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAddComment = () => {}

  const handleCancelComment = () => {
    setIsFocused(false)
    setComment('')
  }

  const handleChangeComment = (e) => {
    setComment(e.target.value)
  }

  useEffect(() => {
    fetchCurrentPost()
  }, [])

  console.log(currentPost)
  return (
    <div className='flex flex-col flex-grow gap-5 p-4 bg-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-medium'>{currentPost.title}</h1>

      <div className='flex justify-between'>
        <p>{currentPost.description}</p>
        <div>
          {currentPost.tags &&
            currentPost.tags.map((tag, index) => (
              <span
                key={index}
                className='text-xs bg-[#E5E7FB] text-gray-600 rounded-full px-3 py-1 ml-2'
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {currentPost.images &&
        currentPost.images.map((image, key) => (
          <Image
            alt=''
            src={image}
            key={key}
            layout='responsive'
            width={16}
            height={9}
            className='max-h-[100vw] h-full w-full'
          />
        ))}

      <div>
        <Button
          variant='outlined'
          startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleLikeButton}
        >
          {currentPost.likes}
        </Button>

        <Button
          variant='outlined'
          startIcon={<FaRegComment />}
          onClick={handleCommentButton}
        >
          {currentPost.comments?.length}
        </Button>
      </div>

      <div id='comment' className='mt-2'>
        <TextField
          value={comment}
          onChange={handleChangeComment}
          placeholder={isFocused ? '' : 'Add a comment'}
          onFocus={() => setIsFocused(true)}
          sx={{
            '& .MuiInputBase-input': {
              padding: 1.5,
            },
          }}
          fullWidth
        />
        {isFocused && (
          <div className='flex justify-end mt-2'>
            <Button
              variant='contained'
              sx={{
                color: 'white',
                backgroundColor: 'grey',
                fontSize: '16px',
                ml: 0.75,
                borderRadius: 5,
              }}
              onClick={handleCancelComment}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{
                color: 'white',
                fontSize: '16px',
                ml: 0.75,
                borderRadius: 5,
              }}
              onClick={handleAddComment}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
