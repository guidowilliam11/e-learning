'use client'

import { useEffect, useState } from 'react'
import ForumPost from './ForumPost'
import NewForum from './NewForum'
import { fetchForumsAndTags } from '../action'

const Forum = ({ user }) => {
  const [open, setOpen] = useState(false)
  const [forumPost, setForumPost] = useState([])
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const data = await fetchForumsAndTags()

      if (data.forumPost) {
        setForumPost(data.forumPost)
      }

      if (data.tags) {
        setTags(data.tags)
      }

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenNewForum = () => {
    tags.length > 0 && setOpen(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='flex flex-col p-6'>
      <div className='flex items-center justify-between mb-4'>
        <input
          type='text'
          placeholder="Let's share what you want to discuss..."
          className='flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
        />
        <button
          className='px-6 py-3 ml-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600'
          onClick={handleOpenNewForum}
        >
          Create Post
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <NewForum
            open={open}
            setOpen={setOpen}
            tags={tags}
            user={user}
            fetchData={fetchData}
          />

          <div className='flex flex-col flex-grow space-y-6'>
            {forumPost.length > 0 &&
              forumPost.map((post) => (
                <ForumPost
                  key={post.id}
                  id={post.id}
                  image={post.images[0] || null}
                  author={post.studentName}
                  date={post.date}
                  content={post.title}
                  tags={post.tags}
                  views={post.views}
                  likes={post.likedBy?.length}
                  comments={post.comments?.length}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Forum
