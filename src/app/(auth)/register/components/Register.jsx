'use client'

import { Button, Card, Grid2, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { email, minLength, object, string } from 'valibot'

import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useEffect } from 'react'
import { registerWithEmailAndPassword } from '@/utils/supabase/auth'

const schema = object({
  email: email(),
  password: string([minLength(6, 'Password is required')]),
  confirm: string([minLength(6, 'Confirm Password is required')]),
})

const Register = () => {
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
      confirm: '',
    },
  })

  useEffect(() => {
    reset(
      {
        email: '',
        password: '',
        confirm: '',
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
      const res = await registerWithEmailAndPassword(userData)

      if (res.data.user) {
        toast.success('Successfully registered!')
        setTimeout(() => {
          reset({
            email: '',
            password: '',
            confirm: '',
          })
          console.log(res.data)
          router.replace('/login')
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
          <Grid2 xs={6}>
            <Controller
              name='email'
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Email'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 xs={6}>
            <Controller
              name='password'
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Password'
                  type='password'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 xs={6}>
            <Controller
              name='confirm'
              control={control}
              rules={{ required: 'Confirm Password is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Confirm Password'
                  type='password'
                  error={!!errors.confirm}
                  helperText={errors.confirm?.message}
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
    </Card>
  )
}

export default Register
