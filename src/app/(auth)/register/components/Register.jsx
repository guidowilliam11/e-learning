'use client'

import { Button, Grid2, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { object, string } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthCard from '@/components/AuthCard'
import { redirect } from 'next/navigation'
import { registerNewUser } from '../../action'

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
  path: ['confirmPassword'],
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

    try {
      const register = await registerNewUser(userData)

      if (register.message !== 'User already exists') {
        setTimeout(() => {
          redirect('/login')
        }, 500)
      }

      alert(register.message)
      reset({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error(error)
    }
  }

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
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
