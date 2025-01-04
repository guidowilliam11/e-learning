import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  TextField,
  Typography,
} from '@mui/material'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { insertNewForumPost } from '../action'

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  images: z.array(
    z
      .instanceof(File)
      .refine((file) => file.type.startsWith('image/'), 'File must be an image')
  ),
})

const NewForum = ({ open, setOpen, tags, user, fetchData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      images: [],
    },
  })

  const watchedImages = watch('images', [])
  const getPreviewURLs = (files) => {
    if (!Array.isArray(files)) return []
    return files
      .filter((file) => file instanceof File)
      .map((file) => URL.createObjectURL(file))
  }

  useEffect(() => {
    reset(
      {
        title: '',
        description: '',
        tags: [],
        images: [],
      },
      { keepValues: false }
    )
  }, [reset])

  const onSubmit = async (data) => {
    try {
      const form = new FormData()
      form.append('studentId', user)
      form.append('title', data.title)
      form.append('description', data.description)
      data.tags.forEach((tag) => form.append('tags', tag))
      data.images.forEach((image) => {
        form.append('file', image)
      })

      const insert = await insertNewForumPost(form)

      if (insert) {
        fetchData()
        closeForm()
      }
    } catch (error) {
      console.error('Validation failed:', error.errors)
    }
  }

  const closeForm = () => {
    setOpen(false)
    reset({
      title: '',
      description: '',
      tags: [],
      images: [],
    })
  }

  return (
    <Dialog
      open={open}
      onClose={closeForm}
      aria-labelledby='form-dialog-title'
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle id='form-dialog-title'>Add New Forum Post</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container justifyContent='center' alignItems='center'>
            <Controller
              name='title'
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Title'
                  error={errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  sx={{ my: 2 }}
                />
              )}
            />

            <Controller
              name='description'
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Description'
                  error={errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                  sx={{ my: 2 }}
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
                  multiple
                  options={tags}
                  getOptionLabel={(option) => option.tag || ''}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  value={tags.filter((tag) => field.value.includes(tag.tag))}
                  onChange={(_, selectedOptions) =>
                    field.onChange(selectedOptions.map((option) => option.tag))
                  }
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Tag'
                      placeholder='Favorites'
                      error={!!errors.tags}
                      helperText={errors.tags?.message}
                      fullWidth
                      sx={{ my: 2 }}
                    />
                  )}
                />
              )}
            />
          </Grid2>

          <Controller
            name='images'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <>
                <Button
                  variant='contained'
                  component='label'
                  sx={{
                    backgroundColor: '#6C63FF',
                    color: 'white',
                    borderRadius: '0.5rem',
                    '&:hover': {
                      backgroundColor: '#5750d9',
                    },
                    transition: 'all 0.3s ease-in-out',
                    my: 1,
                  }}
                  startIcon={<AttachmentIcon />}
                >
                  Upload Images
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      field.onChange(files)
                    }}
                  />
                </Button>

                {errors.images && (
                  <Typography color='error' variant='body2'>
                    {errors.images.message}
                  </Typography>
                )}
              </>
            )}
          />

          {watchedImages.length > 0 && (
            <Grid2 display='flex' gap='2' flexWrap='wrap' my={2.5}>
              {getPreviewURLs(watchedImages).map((url, index) => (
                <Avatar
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  variant='rounded'
                  sx={{ width: 100, height: 100, mr: 3 }}
                />
              ))}
            </Grid2>
          )}

          <Grid2 xs={12} className='flex items-center justify-between gap-4'>
            <Typography
              onClick={closeForm}
              color='primary'
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear Data
            </Typography>
            <Grid2 className='flex items-center gap-4'>
              <Button
                onClick={closeForm}
                variant='contained'
                color='error'
                sx={{
                  borderRadius: '0.5rem',
                }}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  backgroundColor: '#6C63FF',
                  color: 'white',
                  borderRadius: '0.5rem',
                  '&:hover': {
                    backgroundColor: '#5750d9',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
                type='submit'
                variant='contained'
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
