'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { formatHour, formattedDate, generateTimeSlots } from '@/utils/time'

import Calendar from './Calendar'
import AssignmentList from './AssignmentList'
import CurrentAssignment from './CurrentAssignment'
import RemainingTasks from './RemainingTasks'
import TaskPastDue from './TaskPastDue'

import { fetchDailySchedule } from '../action'

const Schedule = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [currentPage, setCurrentPage] = useState('Daily')
  const [schedules, setSchedules] = useState([])
  const [assignmentTitles, setAssignmentTitles] = useState({})
  const [isAddingBySlot, setIsAddingBySlot] = useState({})
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const timeSlots = generateTimeSlots(currentDate.hour())

  const fetchSchedule = async (date) => {
    const schedules = await fetchDailySchedule(user, date)
    if (schedules) {
      const updatedSchedules = schedules.map((schedule) => {
        const timeSlot = formatHour(dayjs(schedule.date).hour())

        return {
          ...schedule,
          timeSlot: timeSlot,
        }
      })

      setSchedules(updatedSchedules)
    }
  }

  const handleAddNewClick = (slot) => {
    setIsAddingBySlot((prev) => ({
      ...prev,
      [slot]: true,
    }))
    setAssignmentTitles((prev) => ({
      ...prev,
      [slot]: '',
    }))
  }

  const handleCancelAdd = (slot) => {
    setIsAddingBySlot((prev) => ({
      ...prev,
      [slot]: false,
    }))
    setAssignmentTitles((prev) => ({
      ...prev,
      [slot]: '',
    }))
  }

  const handleSaveNewAssignment = (slot) => {
    if (assignmentTitles[slot].trim() !== '') {
      const newAssignment = {
        id: schedules.length + 1,
        title: assignmentTitles[slot],
        checked: false,
        timeSlot: slot,
      }
      setSchedules([...schedules, newAssignment])
      setIsAddingBySlot((prev) => ({
        ...prev,
        [slot]: false,
      }))
      setAssignmentTitles((prev) => ({
        ...prev,
        [slot]: '',
      }))
    }
  }

  const handleTitleChange = (slot, value) => {
    setAssignmentTitles((prev) => ({
      ...prev,
      [slot]: value,
    }))
  }

  const handleCheck = (id) => {
    if (id) {
      setSchedules(
        schedules.map((schedule) =>
          schedule._id === id
            ? { ...schedule, checked: !schedule.checked }
            : { ...schedule }
        )
      )
    }
  }

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment)
  }

  const handleCloseAssignment = () => {
    setSelectedAssignment(null)
  }

  useEffect(() => {
    setSchedules([])
    fetchSchedule(currentDate.toISOString())
  }, [currentDate])

  console.log(schedules)

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
        <div
          className={`flex ${
            selectedAssignment ? 'justify-between' : 'w-full'
          } mt-2`}
        >
          <div
            className={`${
              selectedAssignment ? 'w-[49%]' : 'w-full'
            } bg-white p-3`}
          >
            <div className='text-xl font-medium text-black'>
              {currentDate ? formattedDate(currentDate) : 'Loading...'}
            </div>
            <div>
              {timeSlots.map((slot, index) => (
                <div key={`time-slot-${index}`}>
                  <p className='mt-3 text-[#050505a8] text-lg'>{slot}</p>

                  {schedules
                    .filter((schedule) => schedule.timeSlot === slot)
                    .map((assignment) => (
                      <AssignmentList
                        key={`assignment-${assignment.id}`}
                        curr={assignment._id}
                        title={assignment.title}
                        checked={assignment.checked}
                        handleCheck={handleCheck}
                        handleViewAssignment={handleViewAssignment}
                      />
                    ))}

                  {isAddingBySlot[slot] ? (
                    <AssignmentList
                      title={assignmentTitles[slot] || ''}
                      isEditing={true}
                      onLabelChange={(e) =>
                        handleTitleChange(slot, e.target.value)
                      }
                      onSave={() => handleSaveNewAssignment(slot)}
                      cancelAdd={() => handleCancelAdd(slot)}
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
                      onClick={() => handleAddNewClick(slot)}
                    >
                      Add new
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedAssignment && (
            <CurrentAssignment
              selectedAssignment={selectedAssignment}
              handleCloseAssignment={handleCloseAssignment}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Schedule
