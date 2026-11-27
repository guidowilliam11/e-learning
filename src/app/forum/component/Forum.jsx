'use client'

import { useEffect, useMemo, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import ForumPost from './ForumPost'
import NewForum from './NewForum'
import { fetchForums, fetchTags } from '../action'

const Forum = ({ user }) => {
  const [open, setOpen] = useState(false)
  const [forumPost, setForumPost] = useState([])
  const [tags, setTags] = useState([])
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTag, setActiveTag] = useState(null)
  const [sort, setSort] = useState('new')

  const fetchData = async () => {
    try {
      const forumData = await fetchForums()
      const tagData = await fetchTags()

      if (forumData) {
        setForumPost(forumData)
      }

      if (tagData) {
        setTags(tagData.tags)
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

  const shown = useMemo(() => {
    const list = forumPost.filter((p) => !activeTag || p.tags.includes(activeTag))
    return [...list].sort((a, b) =>
      sort === 'top'
        ? (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
        : new Date(b.publishDate) - new Date(a.publishDate)
    )
  }, [forumPost, activeTag, sort])

  return (
    <div className='max-w-[960px]'>
      <div className='flex items-end justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>Forum</h2>
          <p className='mt-1 text-sm text-ink-2'>Questions, study groups and notes from other students.</p>
        </div>
      </div>

      <div className='flex gap-2 mt-6'>
        <label className='flex-1'>
          <span className='sr-only'>Post title</span>
          <input
            type='text'
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenNewForum()}
            placeholder='Ask a question or start a discussion…'
            className='w-full h-10 px-3 text-sm bg-white border rounded-md border-line placeholder:text-ink-3 focus:outline-none focus:border-accent'
          />
        </label>
        <button
          className='flex items-center h-10 gap-1.5 px-4 text-sm font-medium text-white rounded-md bg-accent hover:bg-accent-hover'
          onClick={handleOpenNewForum}
        >
          <LuPlus size={16} /> New post
        </button>
      </div>

      <div className='flex items-center justify-between gap-4 mt-5'>
        <div className='flex flex-wrap gap-2' aria-label='Filter by tag'>
          {[null, ...tags.map((t) => t.tag)].map((t) => (
            <button
              key={t || 'all'}
              aria-pressed={activeTag === t}
              onClick={() => setActiveTag(t)}
              className={`h-7 px-3 text-xs font-medium rounded-full border ${activeTag === t ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line hover:text-ink'}`}
            >
              {t || 'All topics'}
            </button>
          ))}
        </div>
        <label className='flex items-center gap-2 text-sm text-ink-3 shrink-0'>
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)} className='h-8 px-2 text-sm bg-white border rounded-md border-line text-ink focus:outline-none focus:border-accent'>
            <option value='new'>Newest</option>
            <option value='top'>Most liked</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className='mt-4 bg-white border h-80 rounded-card border-line animate-pulse' />
      ) : (
        <>
          <NewForum
            open={open}
            title={title}
            setOpen={setOpen}
            tags={tags}
            user={user}
            fetchData={fetchData}
          />

          {shown.length === 0 ? (
            <p className='py-16 text-sm text-center text-ink-2'>No posts{activeTag ? ` tagged ${activeTag}` : ''} yet.</p>
          ) : (
            <ul className='mt-4 list-none bg-white border divide-y rounded-card border-line divide-line'>
              {shown.map((post) => (
                <ForumPost
                  key={post.id}
                  id={post.id}
                  image={post.images[0] || null}
                  author={post.studentName}
                  date={post.publishDate}
                  title={post.title}
                  description={post.description}
                  tags={post.tags}
                  views={post.views}
                  likes={post.likedBy?.length}
                  comments={post.comments?.length}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default Forum
