import { useState } from 'react'
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

const CurrentAssignment = ({ selectedAssignment, handleCloseAssignment }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isTitleLoading, setIsTitleLoading] = useState(true)
  const [originalTitle, setOriginalTitle] = useState(`
    <div>Assignment 1</div>
  `)
  const [originalDesc, setOriginalDesc] = useState(`
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
      inventore veniam possimus unde, ratione architecto, distinctio
      exercitationem tempore mollitia consectetur quis officiis adipisci animi
      et quisquam eos? Asperiores eius ducimus, cumque nulla iure.
    </div>
  `)
  const [listItems, setListItems] = useState([
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
  ])

  const titleEditor = useEditor({
    extensions: [StarterKit],
    content: originalTitle,
    editable: false,
    immediatelyRender: false,
    onCreate: () => setIsTitleLoading(false),
  })

  const descEditor = useEditor({
    extensions: [StarterKit],
    content: originalDesc,
    editable: false,
    immediatelyRender: false,
  })

  const enableEditing = () => {
    titleEditor.setEditable(true)
    descEditor.setEditable(true)
    setIsEditing(true)
  }

  const handleSave = () => {
    setOriginalTitle(titleEditor.getHTML())
    setOriginalDesc(descEditor.getHTML())
    setIsEditing(false)
    titleEditor.setEditable(false)
    descEditor.setEditable(false)
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

  return (
    <div className='bg-white w-[49%] p-3' onDoubleClick={enableEditing}>
      {isTitleLoading ? (
        <div className='text-xl font-medium text-black'>Loading...</div>
      ) : (
        <>
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
                      onChange={(e) =>
                        handleListItemChange(index, e.target.value)
                      }
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
              <button
                className='mt-2 text-blue-500'
                onClick={handleAddListItem}
              >
                Add Item
              </button>
            )}
          </div>
        </>
      )}

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
