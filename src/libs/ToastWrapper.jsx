'use client'

import { styled } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ToastWrapper = () => {
  const StyledToastContainer = styled(ToastContainer)(({ theme }) => ({
    '.Toastify__toast': {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontSize: '16px',
      padding: '0px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#252A41',
      color: '#E4E6F1',
    },
    '.Toastify__toast-body': {
      display: 'flex',
      alignItems: 'center',
      padding: 0,
    },
    '.Toastify__close-button': {
      color: '#E4E6F1',
      fontSize: '18px',
      marginTop: '10px',
      marginRight: '4px',
      cursor: 'pointer',
      transition: 'color 1s ease',
      '&:hover': {
        color: '#EEEEEE',
      },
    },
  }))

  return (
    <StyledToastContainer
      position='top-right'
      hideProgressBar
      autoClose={false}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  )
}
