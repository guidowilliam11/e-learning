'use client'

import { Button, Card, Grid2, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { email, minLength, object, string } from 'valibot'
import { useRouter } from 'next/navigation'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { loginWithEmailAndPassword } from '@/utils/supabase/auth'

const schema = object({
  email: email(),
  password: string([minLength(1, 'Password is required')]),
})

const Login = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: valibotResolver(schema),
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
          console.log(res)
          router.replace('/')
        }, 1000)
      } else {
        toast.error('Error occurred, please try again')
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: 4,
        gap: 2,
        margin: 'auto',
        maxWidth: { sm: '450px' },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={3}>
          <Grid2 xs={12}>
            <Controller
              name='email'
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Email'
                  placeholder='your@email.com'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 xs={12}>
            <Controller
              name='password'
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Password'
                  placeholder='••••••'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 xs={12} className='flex justify-end gap-4'>
            <Button
              className='text-white'
              type='submit'
              variant='contained'
              color='primary'
            >
              Submit
            </Button>
          </Grid2>
        </Grid2>
      </form>
      <Typography>Don&apos;t </Typography>
    </Card>
  )
}

export default Login
