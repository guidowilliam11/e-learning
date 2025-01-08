import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewForum from '../../component/NewForum'
import { deleteForumPost, fetchTags } from '../../action'
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'

const EditDeleteForum = ({ currentPost, fetchData, user }) => {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState([])

  const fetchTagData = async () => {
    try {
      const data = await fetchTags()

      data && setTags(data.tags)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditPost = () => setOpen(true)

  const handleDeletePost = () => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const deletePost = await deleteForumPost(currentPost._id)
          if (deletePost) {
            resolve(deletePost)
            redirect('/forum')
          } else reject(deletePost)
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Post deleted successfully!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Failed to delete post!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTagData()
  }, [])

  console.log(tags)

  console.log(user, currentPost)

  return (
    <div>
      {user === currentPost.studentId.id && (
        <>
          <IconButton onClick={handleEditPost}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDeletePost}>
            <DeleteIcon />
          </IconButton>

          <NewForum
            open={open}
            setOpen={setOpen}
            editData={currentPost}
            user={user}
            tags={tags}
            fetchData={fetchData}
          />
        </>
      )}
    </div>
  )
}

export default EditDeleteForum
