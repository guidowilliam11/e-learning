'use client'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

const LogoutConfirmationDialog = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          p: 2,
        },
      }}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle sx={{ p: 1.5 }}>Are you sure?</DialogTitle>
      <DialogContent sx={{ p: 1.5 }}>Do you want to log out?</DialogContent>
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
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogoutConfirmationDialog
