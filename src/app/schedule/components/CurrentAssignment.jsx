import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CircleIcon from '@mui/icons-material/Circle'
import CloseIcon from '@mui/icons-material/Close'
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material'
import { toast } from 'react-toastify'

import { fetchAssignmentByAssignmentId, updateAssignment } from '../action'

const CurrentAssignment = ({
  currentDate,
  fetchSchedule,
  handleCloseAssignment,
  selectedAssignment,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [current, setIsCurrent] = useState({})
  const [originalTitle, setOriginalTitle] = useState('')
  const [originalDesc, setOriginalDesc] = useState('')
  const [listItems, setListItems] = useState([])

  const titleEditor = useEditor({
    extensions: [StarterKit],
    content: originalTitle,
    editable: false,
    immediatelyRender: false,
  })

  const descEditor = useEditor({
    extensions: [StarterKit],
    content: originalDesc,
    editable: false,
    immediatelyRender: false,
  })

  const fetchAssignment = async (assignmentId) => {
    try {
      const assignment = await fetchAssignmentByAssignmentId(assignmentId)

      if (assignment) {
        setIsCurrent(assignment)
        setListItems(assignment.list || 'Loading...')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const enableEditing = () => {
    titleEditor.setEditable(true)
    descEditor.setEditable(true)
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const saved = await updateAssignment(
            current._id,
            titleEditor.getText(),
            descEditor.getText(),
            listItems
          )

          if (saved) {
            titleEditor.setEditable(false)
            descEditor.setEditable(false)
            setIsEditing(false)

            fetchAssignment(current._id)

            saved.data.assignment.title !== current.title &&
              fetchSchedule(currentDate)

            resolve(saved)
          } else reject(saved)
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Assignment update success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Assignment update failed!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    titleEditor.commands.setContent(originalTitle)
    descEditor.commands.setContent(originalDesc)
    setIsEditing(false)
    titleEditor.setEditable(false)
    descEditor.setEditable(false)
  }

  const handleListItemChange = (index, value) => {
    const updatedList = [...listItems]
    updatedList[index] = value
    setListItems(updatedList)
  }

  const handleAddListItem = () => {
    setListItems([...listItems, ''])
  }

  const handleRemoveListItem = (index) => {
    setListItems(listItems.filter((_, i) => i !== index))
  }

  useEffect(() => {
    fetchAssignment(selectedAssignment)
  }, [selectedAssignment])

  useEffect(() => {
    const titleContent = `<div>${current?.title || 'Loading...'}</div>`
    const descContent = `<div>${current?.description || 'Loading...'}</div>`

    if (titleEditor && descEditor) {
      titleEditor.commands.setContent(titleContent)
      descEditor.commands.setContent(descContent)
      setOriginalTitle(titleEditor.getHTML())
      setOriginalDesc(descEditor.getHTML())
    }
  }, [current, titleEditor, descEditor])

  return (
    <div className='bg-white w-[49%] p-3' onDoubleClick={enableEditing}>
      <div className='flex justify-between'>
        <EditorContent
          editor={titleEditor}
          className='text-xl font-medium text-black'
        />

        <IconButton onClick={handleCloseAssignment} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </div>
      <EditorContent
        editor={descEditor}
        className='mt-4 text-[#050505a8] text-justify'
      />
      <div className='mt-1 ml-3'>
        <List>
          {listItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CircleIcon color='primary' />
              </ListItemIcon>
              {isEditing ? (
                <TextField
                  value={item}
                  onChange={(e) => handleListItemChange(index, e.target.value)}
                  placeholder='Type here...'
                  variant='standard'
                  size='small'
                  autoFocus
                  sx={{
                    mt: 0.5,
                    '& .MuiInput-root:before': {
                      borderBottom: 'none',
                    },
                    '& .MuiInput-root:after': {
                      borderBottom: 'none',
                    },
                    '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                      borderBottom: 'none',
                    },
                  }}
                />
              ) : (
                <ListItemText primary={item} />
              )}
              {isEditing && (
                <button
                  className='ml-2 text-red-500'
                  onClick={() => handleRemoveListItem(index)}
                >
                  Remove
                </button>
              )}
            </ListItem>
          ))}
        </List>
        {isEditing && (
          <button className='mt-2 text-blue-500' onClick={handleAddListItem}>
            Add Item
          </button>
        )}
      </div>

      {isEditing && (
        <div className='flex justify-end gap-4 mt-4'>
          <button
            className='px-4 py-2 text-gray-600 bg-gray-100 rounded'
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 text-white bg-blue-500 rounded'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default CurrentAssignment
