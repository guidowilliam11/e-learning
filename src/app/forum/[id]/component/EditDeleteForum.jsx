import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewForum from '../../component/NewForum'
import { deleteForumPost, fetchTags } from '../../action'
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'

const EditDeleteForum = ({ currentPost, fetchData, user }) => {
  const [tags, setTags] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const fetchTagData = async () => {
    try {
      const data = await fetchTags()

      data && setTags(data.tags)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditPost = () => setOpen(true)

  const handleOpenDeleteDialog = () => setOpenDelete(true)

  const handleCancelDelete = () => setOpenDelete(false)

  const handleDeletePost = (forumId) => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const deletePost = await deleteForumPost(forumId)
          if (deletePost) {
            resolve(deletePost)
            setOpenDelete(false)
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

  return (
    <div>
      {user === currentPost.studentId.id && (
        <>
          <IconButton onClick={handleEditPost}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleOpenDeleteDialog}>
            <DeleteIcon />
          </IconButton>

          <DeleteConfirmationDialog
            open={openDelete}
            onCancel={handleCancelDelete}
            onConfirm={() => handleDeletePost(currentPost._id)}
            message='forum'
          />

          <NewForum
            open={openEdit}
            setOpen={setOpenEdit}
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
