'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import Calendar from './Calendar'
import AssignmentList from './AssignmentList'
import CurrentAssignment from './CurrentAssignment'
import RemainingTasks from './RemainingTasks'
import TaskPastDue from './TaskPastDue'

const tempData = [
  { id: 1, label: 'Assignment 1', checked: true },
  { id: 2, label: 'Assignment 2', checked: false },
  { id: 3, label: 'Assignment 3', checked: false },
]

const Schedule = () => {
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

  const handleAddNewClick = () => {
    setIsAdding(true)
    setAssignmentTitle('')
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setAssignmentTitle('')
  }

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
    <div className='flex justify-between font-inter'>
      <div className='w-[30%] mr-6'>
        <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />

        <RemainingTasks done={18} total={20} />

        <TaskPastDue taskPast={20} />
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
                  cancelAdd={handleCancelAdd}
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

          <CurrentAssignment />
        </div>
      </div>
    </div>
  )
}

export default Schedule
