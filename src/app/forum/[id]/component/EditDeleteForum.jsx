import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewForum from '../../component/NewForum'
import { fetchTags } from '../../action'

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

  const handleDeletePost = () => {}

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
