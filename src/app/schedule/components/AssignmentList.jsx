import { Checkbox, TextField } from '@mui/material'

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

const AssignmentList = ({
  curr,
  label,
  isEditing = false,
  checked,
  handleCheck,
  onLabelChange,
  onSave,
  cancelAdd,
}) => {
  const handleClick = () => {
    handleCheck(curr)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSave()
    } else if (event.key === 'Escape') {
      cancelAdd()
    }
  }

  return (
    <div
      className='my-3 ml-2'
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Checkbox
        color='warning'
        checked={checked}
        checkedIcon={<RadioButtonCheckedIcon />}
        icon={<RadioButtonUncheckedIcon />}
        onClick={handleClick}
        sx={{
          color: '#FF8E00',
          p: 0.25,
          mr: 0.75,
          '&.Mui-checked': {
            color: '#FF8E00',
          },
        }}
        size='small'
      />

      {isEditing ? (
        <TextField
          value={label}
          onChange={onLabelChange}
          onKeyDown={handleKeyPress}
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
        <span style={{ cursor: 'text' }}>{label}</span>
      )}
    </div>
  )
}

export default AssignmentList
