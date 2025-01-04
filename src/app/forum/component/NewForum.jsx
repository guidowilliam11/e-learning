import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { insertNewForumPost } from '../action'
import { toast } from 'react-toastify'

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
    setValue,
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

  const handleRemoveImage = (index) => {
    const updatedImages = watchedImages.filter((_, i) => i !== index)
    setValue('images', updatedImages, { shouldValidate: true })
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

      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          const insert = await insertNewForumPost(form)

          if (insert) {
            fetchData()
            closeForm()
            resolve(insert)
          } else reject(insert)
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Forum post insert success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Forum post insert failed!'
          },
          autoClose: 2000,
        },
      })
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
                      const newFiles = Array.from(e.target.files || [])
                      const updatedFiles = [...field.value, ...newFiles]
                      field.onChange(updatedFiles)
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
                <Grid2
                  key={index}
                  sx={{ display: 'inline-block', position: 'relative' }}
                >
                  <Avatar
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    variant='rounded'
                    sx={{ width: 150, height: 150, mr: 3 }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 25,
                      color: 'white',
                    }}
                    onClick={() => handleRemoveImage(index)}
                    aria-label='close'
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid2>
              ))}
            </Grid2>
          )}

          <Grid2 className='flex justify-end gap-4'>
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
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewForum
