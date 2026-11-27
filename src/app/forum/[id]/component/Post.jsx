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
import Avatar from '@/components/Avatar'

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

  return (
    <article className='max-w-[860px] p-8 bg-white border rounded-card border-line'>
      {notFound ? (
        <p className='text-sm text-ink-2'>This post no longer exists. Taking you back to the forum.</p>
      ) : !currentPost ? (
        <div className='h-48 animate-pulse' />
      ) : (
        <div className='flex flex-col gap-6'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar name={currentPost.studentId.fullName} size={40} />
              <div>
                <p className='text-sm font-semibold'>{currentPost.studentId.fullName}</p>
                <p className='text-xs text-ink-3'>Posted {postFormattedDate(currentPost.createdAt)}</p>
              </div>
            </div>
            <EditDeleteForum currentPost={currentPost} fetchData={fetchCurrentPost} user={user} />
          </div>

          <div>
            <h1 className='text-2xl font-semibold leading-tight tracking-tight'>{currentPost.title}</h1>
            {currentPost.tags?.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {currentPost.tags.map((tag, index) => (
                  <span key={index} className='px-2 py-0.5 text-xs font-medium rounded border bg-page text-ink-2 border-line'>{tag}</span>
                ))}
              </div>
            )}
            <p className='mt-4 text-[15px] leading-7 whitespace-pre-wrap text-ink'>{currentPost.description}</p>
          </div>

          {currentPost.images?.map((image, key) => (
            <Image key={key} alt='' src={image} priority width={800} height={450} className='w-full h-auto border rounded-md border-line' />
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
        </div>
      )}
    </article>
  )
}

export default Post
