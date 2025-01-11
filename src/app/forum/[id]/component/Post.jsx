'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { toast } from 'react-toastify'

import {
  fetchForumPost,
  fetchForumPostMoreComments,
  fetchForumPostNotView,
  insertCommentToPost,
  updateLikeToPost,
} from '../action'

import CommentLike from './CommentLike'
import CommentSection from './CommentSection'
import CommentField from './CommentField'
import { redirect } from 'next/navigation'
import { postFormattedDate } from '@/utils/time'
import EditDeleteForum from './EditDeleteForum'

const Post = ({ id, user }) => {
  const [currentPost, setCurrentPost] = useState(null)
  const [comment, setComment] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [commentDepth, setCommentDepth] = useState(5)
  const [notFound, setNotFound] = useState(false)

  const fetchCurrentPost = async () => {
    try {
      const post = await fetchForumPost(id)
      setNotFound(false)

      if (post.error) {
        setNotFound(true)

        return setTimeout(() => redirect('/forum'), 1000)
      }

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

  const fetchCurrentPostMoreComments = async () => {
    try {
      const post = await fetchForumPostMoreComments(id, commentDepth)

      if (post) {
        setCurrentPost((prevPost) => ({
          ...prevPost,
          comments: post.comments,
        }))
        setCommentDepth(commentDepth + 1)
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
      {notFound ? (
        <div>Forum not found. Redirecting you back to the forum page.</div>
      ) : !currentPost ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className='flex justify-between'>
            <div className='flex'>
              <Image
                alt='profile'
                src='/images/default-profile-picture.webp'
                width={40}
                height={40}
              />
              <div className='flex flex-col ml-2'>
                <p className='text-sm font-bold'>
                  {currentPost.studentId.fullName}
                </p>
                <p className='text-sm'>
                  Posted on {postFormattedDate(currentPost.createdAt)}
                </p>
              </div>
            </div>

            <EditDeleteForum
              currentPost={currentPost}
              fetchData={fetchCurrentPost}
              user={user}
            />
          </div>

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
                  className='absolute inset-0 blur-md w-[100%] h-[100%]'
                  style={{
                    backgroundImage: `url(${encodeURI(image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                <div className='relative z-10'>
                  <Image
                    alt=''
                    src={image}
                    priority
                    width={700}
                    height={300}
                    className='w-auto h-auto rounded-md'
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
            forumId={currentPost._id}
            fetchPost={fetchCurrentPostNoView}
            fetchPostMoreComment={fetchCurrentPostMoreComments}
          />
        </>
      )}
    </div>
  )
}

export default Post
