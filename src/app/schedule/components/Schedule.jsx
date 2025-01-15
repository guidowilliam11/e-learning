'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { toast } from 'react-toastify'

import {
  fetchDailySchedule,
  insertSchedule,
  updateScheduleCheckStatus,
} from '../action'
import { formatHour, formattedDate, generateTimeSlots } from '@/utils/time'

import Calendar from './Calendar'
import AssignmentList from './AssignmentList'
import CurrentAssignment from './CurrentAssignment'
import RemainingTasks from './RemainingTasks'
import TaskPastDue from './TaskPastDue'
import PastSchedules from './PastSchedules'
import FutureSchedules from './FutureSchedules'
import { useSearchParams } from 'next/navigation'

const Schedule = ({ user }) => {
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('assignmentId')

  const [currentDate, setCurrentDate] = useState(dayjs())
  const [isLoading, setIsLoading] = useState(true)
  const [schedules, setSchedules] = useState([])
  const [todaySchedules, setTodaySchedules] = useState([])
  const [assignmentTitles, setAssignmentTitles] = useState({})
  const [isAddingBySlot, setIsAddingBySlot] = useState({})
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const fetchSchedule = async (date) => {
    try {
      setIsLoading(true)
      const isToday = dayjs(date).isSame(dayjs(), 'day')
      const schedules = await fetchDailySchedule(user, date)
      if (schedules) {
        const updatedSchedules = schedules.map((schedule) => {
          const timeSlot = formatHour(dayjs(schedule.date).hour())

          return {
            ...schedule,
            timeSlot: timeSlot,
          }
        })

        if (isToday) {
          setTodaySchedules(updatedSchedules)
        }

        setSchedules(updatedSchedules)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
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

  const handleSaveNewAssignment = async (slot) => {
    try {
      if (assignmentTitles[slot] === '') {
        return toast.error({
          render() {
            return 'Assignment title cannot be empty!'
          },
          autoClose: 2000,
        })
      }
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (assignmentTitles[slot].trim() !== '') {
            const newAssignment = {
              title: assignmentTitles[slot],
              checked: false,
              timeSlot: slot,
            }

            const currentTimeSlot = dayjs(slot, 'hh:mm A')

            const combinedDateTime = dayjs(currentDate)
              .hour(currentTimeSlot.hour())
              .minute(currentTimeSlot.minute())
              .second(0)
              .toISOString()

            const inserted = await insertSchedule(
              user.id,
              newAssignment.title,
              combinedDateTime
            )

            if (inserted) {
              fetchSchedule(currentDate.toISOString())
              resolve(inserted)
              setIsAddingBySlot((prev) => ({
                ...prev,
                [slot]: false,
              }))
              setAssignmentTitles((prev) => ({
                ...prev,
                [slot]: '',
              }))
            } else reject(inserted)
          }
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Insert new assignment success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Insert new assignment failed!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleTitleChange = (slot, value) => {
    setAssignmentTitles((prev) => ({
      ...prev,
      [slot]: value,
    }))
  }

  const handleCheck = (id) => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (id) {
            const currentSchedule = schedules.find(
              (schedule) => schedule._id === id
            )
            const check = await updateScheduleCheckStatus(
              id,
              !currentSchedule.checked
            )

            if (check) {
              fetchSchedule(currentDate.toISOString())
              resolve(check)
            } else reject(check)
          }
        }, 500)
      })

      return toast.promise(promise, {
        pending: 'Processing...',
        success: {
          render() {
            return 'Schedule check update success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Schedule check update failed!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleViewAssignment = (assignment) => setSelectedAssignment(assignment)

  const handleCloseAssignment = () => setSelectedAssignment(null)

  const timeSlots = generateTimeSlots()

  const futureTimeSlots = timeSlots.filter(
    (slot) =>
      (parseInt(slot) % 12) + (slot.includes('PM') ? 12 : 0) >=
      currentDate.hour()
  )

  const isPastDate = currentDate.toDate().getDate() < dayjs().toDate().getDate()
  const isFutureDate =
    currentDate.toDate().getDate() > dayjs().toDate().getDate()

  const filteredTimeSlots = isPastDate
    ? timeSlots.filter((slot) =>
        schedules.some(({ timeSlot }) => timeSlot === slot)
      )
    : timeSlots

  useEffect(() => {
    setSchedules([])
    fetchSchedule(currentDate.toISOString())
    handleCloseAssignment()
  }, [currentDate])

  useEffect(() => {
    assignmentId && handleViewAssignment(assignmentId)
  }, [assignmentId])

  return (
    <div className='flex justify-between font-inter'>
      <div className='w-[30%] mr-6'>
        <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />

        <RemainingTasks
          schedules={todaySchedules}
          futureTimeSlots={futureTimeSlots}
        />

        <TaskPastDue
          schedules={todaySchedules}
          futureTimeSlots={futureTimeSlots}
        />
      </div>

      <div className='flex flex-col w-full'>
        <div
          className={`flex ${
            selectedAssignment ? 'justify-between' : 'w-full'
          } mt-2`}
        >
          <div
            className={`${
              selectedAssignment ? 'w-[49%]' : 'w-full'
            } bg-white p-3 rounded-md`}
          >
            <div className='text-xl font-medium text-black'>
              {currentDate ? formattedDate(currentDate) : 'Loading...'}
            </div>

            <div className='max-h-[75vh] overflow-y-auto pr-2'>
              {isLoading ? (
                <div className='text-[#050505a8] text-lg mt-3'>Loading...</div>
              ) : (
                <>
                  {currentDate.toDate().getDate() ===
                  dayjs().toDate().getDate() ? (
                    <>
                      <PastSchedules
                        currentDate={currentDate}
                        schedules={todaySchedules}
                        timeSlots={timeSlots}
                        handleCheck={handleCheck}
                        handleViewAssignment={handleViewAssignment}
                      />

                      <FutureSchedules
                        currentDate={currentDate}
                        schedules={todaySchedules}
                        futureTimeSlots={futureTimeSlots}
                        assignmentTitles={assignmentTitles}
                        isAddingBySlot={isAddingBySlot}
                        handleCheck={handleCheck}
                        handleCancelAdd={handleCancelAdd}
                        handleViewAssignment={handleViewAssignment}
                        handleAddNewClick={handleAddNewClick}
                        handleTitleChange={handleTitleChange}
                        handleSaveNewAssignment={handleSaveNewAssignment}
                      />
                    </>
                  ) : (
                    <>
                      {filteredTimeSlots.length === 0 && isPastDate ? (
                        <div className='text-[#050505a8] text-lg mt-3'>
                          You have no schedules for this day.
                        </div>
                      ) : (
                        filteredTimeSlots.map((slot, index) => (
                          <div key={`time-slot-${index}`}>
                            <p className='mt-3 text-[#050505a8] text-lg'>
                              {slot}
                            </p>

                            {schedules
                              .filter((schedule) => schedule.timeSlot === slot)
                              .map((assignment) => (
                                <AssignmentList
                                  key={`assignment-${assignment._id}`}
                                  curr={assignment._id}
                                  assignmentId={assignment.assignmentId}
                                  title={assignment.title}
                                  checked={assignment.checked}
                                  handleCheck={handleCheck}
                                  handleViewAssignment={handleViewAssignment}
                                />
                              ))}

                            {isFutureDate &&
                              (isAddingBySlot[slot] ? (
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
                                  startIcon={
                                    <AddIcon size={14} color='#050505a8' />
                                  }
                                  sx={{
                                    color: '#050505a8',
                                    fontSize: '16px',
                                    ml: 0.75,
                                  }}
                                  onClick={() => handleAddNewClick(slot)}
                                >
                                  Add new
                                </Button>
                              ))}
                          </div>
                        ))
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {selectedAssignment && (
            <CurrentAssignment
              currentDate={currentDate.toISOString()}
              fetchSchedule={fetchSchedule}
              handleCloseAssignment={handleCloseAssignment}
              selectedAssignment={selectedAssignment}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Schedule
