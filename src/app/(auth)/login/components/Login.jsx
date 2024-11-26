'use client'

import { Button, Grid2, styled, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { loginWithEmailAndPassword } from '@/utils/supabase/auth'
import AuthCard from '@/components/AuthCard'
import { zodResolver } from '@hookform/resolvers/zod'
import { object, string } from 'zod'

const schema = object({
  email: string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: string().min(6, { message: 'Password is required' }),
})

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    reset(
      {
        email: '',
        password: '',
      },
      { keepValues: false }
    )
  }, [reset])

  const onSubmit = async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
    }

    try {
      const res = await loginWithEmailAndPassword(userData)

      if (res.data.user) {
        toast.success('Successfully signed in!')
        setTimeout(() => {
          reset({
            email: '',
            password: '',
          })
        }, 1000)
      } else {
        toast.error('Error occurred, please try again')
      }
    } catch (error) {
      throw error
    }
  }

  const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': {
        borderColor: '#F2994A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F2994A',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#F2994A',
    },
    '& .MuiInputBase-root': {
      fontSize: '0.925rem',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.925rem',
    },
  })

  return (
    <AuthCard
      title='Login to ZEAL'
      footerText="Don't have an account?"
      footerLink='/register'
      footerLinkText='Register'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container justifyContent='center' alignItems='center'>
          <Controller
            name='email'
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Email'
                placeholder='your@email.com'
                error={errors.email}
                helperText={errors.email?.message}
                fullWidth
                size='small'
                sx={{
                  my: 2,
                }}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Password'
                type='password'
                placeholder='••••••'
                error={errors.password}
                helperText={errors.password?.message}
                fullWidth
                size='small'
                sx={{ mb: 4 }}
              />
            )}
          />
        </Grid2>
        <Grid2 xs={12}>
          <Button
            type='submit'
            variant='contained'
            sx={{
              backgroundColor: '#6C63FF',
              color: 'white',
              py: 1,
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: '#5750d9',
              },
              transition: 'all 0.3s ease-in-out',
            }}
            fullWidth
          >
            Login
          </Button>
        </Grid2>
      </form>
    </AuthCard>
  )
}

export default Login
