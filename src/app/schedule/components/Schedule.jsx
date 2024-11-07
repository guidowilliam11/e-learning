'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import {
  Button,
  createTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CircleIcon from '@mui/icons-material/Circle'
import Calendar from './Calendar'
import AssignmentList from './AssignmentList'

const tempData = [
  { id: 1, label: 'Assignment 1', checked: true },
  { id: 2, label: 'Assignment 2', checked: false },
  { id: 3, label: 'Assignment 3', checked: false },
]

const Schedule = () => {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: 'inter',
      },
    },
  })

  const [currentDate, setCurrentDate] = useState(null)
  const [currentPage, setCurrentPage] = useState('Daily')

  const formattedDate = (date) => {
    return date.format('ddd MMM DD YYYY')
  }

  useEffect(() => {
    setCurrentDate(dayjs())
  }, [])

  const [isAdding, setIsAdding] = useState(false)
  const [assignments, setAssignments] = useState(tempData)
  const [assignmentTitle, setAssignmentTitle] = useState('')

  console.log(assignments)

  const handleAddNewClick = () => setIsAdding(true)

  const handleSaveNewAssignment = () => {
    if (assignmentTitle.trim() !== '') {
      const newAssignment = {
        id: assignments.length + 1,
        label: assignmentTitle,
        checked: false,
      }
      setAssignments([...assignments, newAssignment])
      setAssignmentTitle('')
      setIsAdding(false)
    }
  }

  const handleCheck = (curr) => {
    if (curr) {
      setAssignments(
        assignments.map((value) =>
          value.id === curr
            ? { ...value, checked: !value.checked }
            : { ...value }
        )
      )
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='flex justify-between font-inter'>
        <div className='w-[30%] mr-6'>
          <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />

          <div className='flex flex-col justify-between bg-[#545EE1] text-white rounded-lg p-6 h-[30%]'>
            <h2 className='mb-2 text-base font-normal'>
              Today&apos;s Remaining Tasks
            </h2>
            <p className='content-center flex-grow text-6xl font-medium text-start'>
              18 / 20
            </p>
          </div>

          <div className='flex flex-col justify-between bg-white text-black rounded-lg p-6 h-[30%] mt-4'>
            <h2 className='mb-2 text-base font-normal'>Task Past Due</h2>
            <p className='content-center flex-grow text-6xl font-medium text-start'>
              20
            </p>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='bg-[#545EE1] p-3 text-white rounded-md'>
            <Link
              href={''}
              className={`${
                currentPage === 'Daily'
                  ? 'text-[#F99B26] border-b-2 border-current pb-[1px] inline-block'
                  : 'text-white'
              } mr-4`}
              onClick={() => setCurrentPage('Daily')}
            >
              Daily
            </Link>
            <Link
              href={''}
              className={`${
                currentPage === 'Weekly'
                  ? 'text-[#F99B26] border-b-2 border-current pb-[1px] inline-block'
                  : 'text-white'
              }`}
              onClick={() => setCurrentPage('Weekly')}
            >
              Weekly
            </Link>
          </div>
          <div className='flex justify-between mt-2'>
            <div className='w-[49%] bg-white p-3'>
              <div className='text-xl font-medium text-black'>
                {currentDate ? formattedDate(currentDate) : 'Loading...'}
              </div>
              <div>
                <p className='mt-3 text-[#050505a8] text-lg'>08:00 AM</p>

                <Button
                  variant='text'
                  startIcon={<AddIcon size={14} color='#050505a8' />}
                  sx={{
                    color: '#050505a8',
                    textTransform: 'none',
                    fontSize: '16px',
                    ml: 0.75,
                  }}
                >
                  Add new
                </Button>
              </div>
              <div>
                <p className='mt-3 text-[#050505a8] text-lg'>09:00 AM</p>

                {assignments.map((assignment) => (
                  <AssignmentList
                    key={assignment.id}
                    curr={assignment.id}
                    label={assignment.label}
                    checked={assignment.checked}
                    handleCheck={handleCheck}
                  />
                ))}

                {isAdding ? (
                  <AssignmentList
                    label={assignmentTitle}
                    isEditing={true}
                    onLabelChange={(e) => setAssignmentTitle(e.target.value)}
                    onSave={handleSaveNewAssignment}
                  />
                ) : (
                  <Button
                    variant='text'
                    startIcon={<AddIcon size={14} color='#050505a8' />}
                    sx={{
                      color: '#050505a8',
                      textTransform: 'none',
                      fontSize: '16px',
                      ml: 0.75,
                    }}
                    onClick={handleAddNewClick}
                  >
                    Add new
                  </Button>
                )}
              </div>
              <div>
                <p className='mt-3 text-[#050505a8] text-lg'>10:00 AM</p>
                <Button
                  variant='text'
                  startIcon={<AddIcon size={14} color='#050505a8' />}
                  sx={{
                    color: '#050505a8',
                    textTransform: 'none',
                    fontSize: '16px',
                    ml: 0.75,
                  }}
                >
                  Add new
                </Button>
              </div>
              <div>
                <p className='mt-3 text-[#050505a8] text-lg'>11:00 AM</p>
                <Button
                  variant='text'
                  startIcon={<AddIcon size={14} color='#050505a8' />}
                  sx={{
                    color: '#050505a8',
                    textTransform: 'none',
                    fontSize: '16px',
                    ml: 0.75,
                  }}
                >
                  Add new
                </Button>
              </div>
            </div>
            <div className='bg-white w-[49%] p-3'>
              <div className='text-xl font-medium text-black'>Assignment 1</div>
              <div className='mt-4 text-[#050505a8] text-justify'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
                inventore veniam possimus unde, ratione architecto, distinctio
                exercitationem tempore mollitia consectetur quis officiis
                adipisci animi et quisquam eos? Asperiores eius ducimus, cumque
                nulla iure
              </div>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Lorem ipsum dolor sit amet' />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CircleIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Lorem ipsum dolor sit amet' />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CircleIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Lorem ipsum dolor sit amet' />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <CircleIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary='Lorem ipsum dolor sit amet' />
                </ListItem>
              </List>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Schedule
