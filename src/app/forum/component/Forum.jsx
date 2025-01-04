'use client'

import React, { useEffect, useState } from 'react'
import ForumPost from './ForumPost'
import NewForum from './NewForum'
import { fetchForumsAndTags } from '../action'

const Forum = ({ user }) => {
  const [open, setOpen] = useState(false)
  const [forum, setForum] = useState([])
  const [tags, setTags] = useState([])

  const fetchData = async () => {
    try {
      const data = await fetchForumsAndTags()

      if (data.forum) {
        setForum(data.forum)
      }

      if (data.tags) {
        setTags(data.tags)
      }
    } catch (error) {
      console.error(error)
    }
  }

  console.log(forum, tags)

  const handleOpenNewForum = () => {
    tags.length > 0 && setOpen(true)
  }

  const posts = [
    {
      id: 1,
      avatarSrc: '/profile-icon.png', // Update with actual avatar URL or path
      author: 'John Doe',
      date: '3 weeks ago',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at lacinia elit...',
      tags: ['AI', 'Science', 'Code'],
      views: 615324,
      likes: 36656,
      comments: 56,
    },
    {
      id: 2,
      avatarSrc: '/profile-icon.png', // Update with actual avatar URL or path
      author: 'Jane Smith',
      date: '2 weeks ago',
      content:
        'Exploring the concepts of calculus and its applications in physics...',
      tags: ['Math', 'Physics', 'Research'],
      views: 123456,
      likes: 7890,
      comments: 23,
    },
    {
      id: 3,
      avatarSrc: '/profile-icon.png',
      author: 'Alice Johnson',
      date: '5 days ago',
      content:
        'Has anyone tried using React with TypeScript? Looking for best practices...',
      tags: ['React', 'TypeScript', 'Web Development'],
      views: 98321,
      likes: 4560,
      comments: 34,
    },
    {
      id: 4,
      avatarSrc: '/profile-icon.png',
      author: 'Michael Brown',
      date: '1 month ago',
      content:
        'What are the latest advancements in machine learning algorithms?',
      tags: ['Machine Learning', 'AI', 'Data Science'],
      views: 154789,
      likes: 20456,
      comments: 78,
    },
    {
      id: 5,
      avatarSrc: '/profile-icon.png',
      author: 'Emily Davis',
      date: '3 days ago',
      content:
        "Can someone explain the basics of blockchain technology in layman's terms?",
      tags: ['Blockchain', 'Technology', 'Cryptography'],
      views: 84732,
      likes: 4890,
      comments: 19,
    },
    {
      id: 6,
      avatarSrc: '/profile-icon.png',
      author: 'Daniel Lee',
      date: '4 hours ago',
      content:
        'Just published a new blog post on the importance of user experience design...',
      tags: ['UX', 'Design', 'Blogging'],
      views: 43120,
      likes: 1523,
      comments: 10,
    },
    {
      id: 7,
      avatarSrc: '/profile-icon.png',
      author: 'Sophia Turner',
      date: '1 week ago',
      content:
        "Has anyone worked with Python's TensorFlow library? Any tips for beginners?",
      tags: ['Python', 'TensorFlow', 'Machine Learning'],
      views: 76985,
      likes: 3920,
      comments: 27,
    },
    {
      id: 8,
      avatarSrc: '/profile-icon.png',
      author: 'Oliver Martinez',
      date: '6 days ago',
      content:
        "What's the difference between supervised and unsupervised learning?",
      tags: ['AI', 'Supervised Learning', 'Unsupervised Learning'],
      views: 65321,
      likes: 3456,
      comments: 15,
    },
    {
      id: 9,
      avatarSrc: '/profile-icon.png',
      author: 'Isabella Clark',
      date: '8 hours ago',
      content:
        'Looking for resources on game development with Unity. Any recommendations?',
      tags: ['Unity', 'Game Development', 'Resources'],
      views: 41232,
      likes: 2950,
      comments: 12,
    },
    {
      id: 10,
      avatarSrc: '/profile-icon.png',
      author: 'Liam Wilson',
      date: '2 days ago',
      content:
        'Does anyone have experience with Kubernetes for deploying microservices?',
      tags: ['Kubernetes', 'Microservices', 'DevOps'],
      views: 56987,
      likes: 3340,
      comments: 20,
    },
  ]

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

      <NewForum
        open={open}
        setOpen={setOpen}
        tags={tags}
        user={user}
        fetchData={fetchData}
      />

      <div className='flex flex-col flex-grow space-y-6'>
        {posts.map((post) => (
          <ForumPost
            key={post.id}
            avatarSrc={post.avatarSrc}
            author={post.author}
            date={post.date}
            content={post.content}
            tags={post.tags}
            views={post.views}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>
    </div>
  )
}

export default Forum
