import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { object, string } from 'zod'

const schema = object({
  title: string().min(1, { message: 'Title is required' }),
  tags: string().min(1, { message: 'Tag is required' }),
})

const NewForum = ({ open, onClose, tags, fetchData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      tags: '',
    },
  })

  useEffect(() => {
    reset(
      {
        title: '',
        tags: '',
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
        toast.success('Successfully signed in!')
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

  const clearData = () => {
    reset({
      title: '',
      tags: '',
    })
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
    <Dialog open={open} onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>Add New Forum Post</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container justifyContent='center' alignItems='center'>
            <Controller
              name='title'
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label='Title'
                  error={errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name='tags'
              control={control}
              rules={{ required: 'Tag is required' }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={tags}
                  getOptionLabel={(tag) => tag}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label='Tag'
                      placeholder='Favorites'
                      error={!!errors.tags}
                      helperText={errors.tags?.message}
                      fullWidth
                    />
                  )}
                  fullWidth
                />
              )}
            />
          </Grid2>

          <Grid2 xs={12} className='flex items-center justify-between gap-4'>
            <Typography
              onClick={clearData}
              color='primary'
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear Data
            </Typography>
            <Grid2 className='flex items-center gap-4'>
              <Button onClick={onClose} variant='outlined' color='error'>
                Cancel
              </Button>
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
      </DialogContent>
    </Dialog>
  )
}

export default NewForum
