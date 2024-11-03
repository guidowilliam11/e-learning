import { useEffect, useState } from 'react'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'

const AssignmentList = ({
  label,
  isEditing = false,
  handleCheck,
  onLabelChange,
  onSave,
}) => {
  const [selectedValue, setSelectedValue] = useState(null)

  const handleClick = (event) => {
    setSelectedValue((prevValue) =>
      prevValue === event.target.value ? '' : event.target.value
    )
  }

  useEffect(() => {
    if (handleCheck) {
      handleCheck(selectedValue)
    }
  }, [selectedValue])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSave()
    }
  }

  return (
    <div
      className='my-3 ml-4'
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <FormControl>
        <RadioGroup value={selectedValue}>
          <FormControlLabel
            value={label}
            control={
              <Radio
                color='warning'
                sx={{ color: '#FF8E00', p: 0.25, mr: 0.5 }}
                size='small'
                onClick={handleClick}
              />
            }
            label={
              isEditing ? (
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
                label
              )
            }
          />
        </RadioGroup>
      </FormControl>
    </div>
  )
}

export default AssignmentList
