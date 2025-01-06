'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { toast } from 'react-toastify'

import {
  fetchForumPost,
  fetchForumPostNotView,
  insertCommentToPost,
  updateLikeToPost,
} from '../action'

import CommentLike from './CommentLike'
import CommentSection from './CommentSection'
import CommentField from './CommentField'

const Post = ({ id, user }) => {
  const [currentPost, setCurrentPost] = useState(null)
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

  const fetchCurrentPostNoView = async () => {
    try {
      const post = await fetchForumPostNotView(id)

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
        fetchCurrentPostNoView()
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

  const handleAddComment = () => {
    try {
      if (comment === '') {
        return toast.error('Comment fields cannot be empty!')
      }

      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const newComment = await insertCommentToPost(id, user, comment)

          if (newComment) {
            fetchCurrentPostNoView()
            handleCancelComment()
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
      {!currentPost ? (
        <div>Loading...</div>
      ) : (
        <>
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
              <div
                key={key}
                className='relative flex items-center justify-center w-full h-auto overflow-hidden'
              >
                <div
                  className='absolute inset-0 blur-md'
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                />

                <div className='relative z-10'>
                  <Image
                    alt=''
                    src={image}
                    layout='intrinsic'
                    width={900}
                    height={300}
                    className='rounded-md'
                  />
                </div>
              </div>
            ))}

          <CommentLike
            view={currentPost.views}
            isLiked={isLiked}
            likes={currentPost.likedBy?.length}
            comments={currentPost.comments?.length}
            handleLikeButton={handleLikeButton}
            handleCommentButton={handleCommentButton}
          />

          <CommentField
            comment={comment}
            handleChangeComment={handleChangeComment}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            handleAddComment={handleAddComment}
            handleCancelComment={handleCancelComment}
          />

          <CommentSection
            comments={currentPost.comments}
            user={user}
            fetchPost={fetchCurrentPostNoView}
          />
        </>
      )}
    </div>
  )
}

export default Post
