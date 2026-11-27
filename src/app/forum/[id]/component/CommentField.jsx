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
    <div id='comment' className='pt-6 border-t border-line'>
      <TextField
        value={comment}
        onChange={handleChangeComment}
        placeholder='Add a comment'
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) =>
          e.key === 'Escape' ? handleCancelComment() : setIsFocused(true)
        }
        size='small'
        multiline
        minRows={isFocused ? 3 : 1}
        fullWidth
      />
      {isFocused && (
        <div className='flex justify-end mt-2'>
          <Button
            variant='contained'
            disableElevation
            sx={{ color: '#52525B', backgroundColor: '#F4F4F5', fontSize: 14, ml: 0.75, borderRadius: 2, '&:hover': { backgroundColor: '#E4E4E7' } }}
            onClick={handleCancelComment}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            disableElevation
            sx={{ color: 'white', fontSize: 14, ml: 0.75, borderRadius: 2 }}
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
