'use client'

import { Button, Grid2, styled, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { object, string } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthCard from '@/components/AuthCard'

const schema = object({
  fullName: string().min(6, { message: 'Name is required' }),
  email: string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirmPassword: string().min(6, {
    message: 'Confirm Password must be at least 6 characters long',
  }),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords must match',
})

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    reset(
      {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      { keepValues: false }
    )
  }, [reset])

  const onSubmit = async (data) => {
    const userData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    }
    console.log(userData)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Sign-up failed')
      } else {
        const data = await response.json()
        alert(data.message)
        setTimeout(() => {
          reset({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          })
        }, 1000)
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
      title='Create an Account'
      footerText='Already have an account?'
      footerLink='/login'
      footerLinkText='Login'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container justifyContent='center' alignItems='center'>
          <Controller
            name='fullName'
            control={control}
            rules={{ required: 'Full Name is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Full Name'
                error={errors.fullName}
                helperText={errors.fullName?.message}
                fullWidth
                size='small'
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Email'
                error={errors.email}
                helperText={errors.email?.message}
                fullWidth
                size='small'
                sx={{ my: 2 }}
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
                error={errors.password}
                helperText={errors.password?.message}
                fullWidth
                size='small'
              />
            )}
          />
          <Controller
            name='confirmPassword'
            control={control}
            rules={{ required: 'Confirm Password is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Confirm Password'
                type='password'
                error={errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                size='small'
                margin='normal'
                sx={{ mb: 4 }}
              />
            )}
          />
        </Grid2>
        <Grid2 xs={12}>
          <Button
            type='submit'
            variant='contained'
            fullWidth
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
          >
            Submit
          </Button>
        </Grid2>
      </form>
    </AuthCard>
  )
}

export default Register
