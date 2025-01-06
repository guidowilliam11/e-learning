import { Button, TextField } from '@mui/material'

const CommentField = ({
  comment,
  isFocused,
  setIsFocused,
  handleChangeComment,
  handleCancelComment,
  handleAddComment,
}) => {
  return (
    <div id='comment' className='mt-2'>
      <TextField
        value={comment}
        onChange={handleChangeComment}
        placeholder={isFocused ? '' : 'Add a comment'}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) =>
          e.key === 'Escape' ? handleCancelComment() : setIsFocused(true)
        }
        sx={{
          '& .MuiInputBase-input': {
            padding: 1.5,
          },
        }}
        fullWidth
      />
      {isFocused && (
        <div className='flex justify-end mt-2'>
          <Button
            variant='contained'
            sx={{
              color: 'white',
              backgroundColor: 'grey',
              fontSize: '16px',
              ml: 0.75,
              borderRadius: 5,
            }}
            onClick={handleCancelComment}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{
              color: 'white',
              fontSize: '16px',
              ml: 0.75,
              borderRadius: 5,
            }}
            onClick={handleAddComment}
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  )
}

export default CommentField
