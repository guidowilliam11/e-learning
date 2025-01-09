'use client'

import { Button, Grid2, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import AuthCard from '@/components/AuthCard'
import { zodResolver } from '@hookform/resolvers/zod'
import { object, string } from 'zod'
import { redirect } from 'next/navigation'

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
    const email = data.email
    const password = data.password

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Sign-in failed')
      } else {
        alert('Sign-in success!')
        setTimeout(() => {
          reset({
            email: '',
            password: '',
          })
          redirect('/')
        }, 500)
      }
    } catch (error) {
      throw error
    }
  }

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
              <TextField
                {...field}
                label='Email'
                placeholder='your@email.com'
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
