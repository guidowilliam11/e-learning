'use client'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

const DeleteConfirmationDialog = ({ open, onCancel, onConfirm, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ p: 1.5 }}>Confirm Deletion</DialogTitle>
      <DialogContent sx={{ p: 1.5 }}>
        Are you sure you want to delete {message}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant='outlined' color='primary'>
          Cancel
        </Button>
        <Button
          className='text-white '
          type='submit'
          variant='contained'
          color='primary'
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
