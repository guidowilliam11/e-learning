'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { toast } from 'react-toastify'

import {
  fetchDailySchedule,
  insertSchedule,
  updateScheduleCheckStatus,
} from '../action'
import { formatHour, generateTimeSlots } from '@/utils/time'

import Calendar from './Calendar'
import AssignmentList from './AssignmentList'
import CurrentAssignment from './CurrentAssignment'
import RemainingTasks from './RemainingTasks'
import TaskPastDue from './TaskPastDue'
import PastSchedules from './PastSchedules'
import FutureSchedules, { HourRow } from './FutureSchedules'
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

  const isPastDate = currentDate.isBefore(dayjs(), 'day')
  const isFutureDate = currentDate.isAfter(dayjs(), 'day')

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

  // The calendar reads the browser's clock, so it renders after hydration.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isToday = currentDate.isSame(dayjs(), 'day')
  const dayTasks = isToday ? todaySchedules : schedules

  return (
    <div className='mx-auto max-w-[1200px] grid grid-cols-[300px_minmax(0,1fr)] gap-6 items-start'>
      <div className='space-y-4'>
        <div className='bg-white border rounded-card border-line'>
          {mounted ? <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} /> : <div className='h-[334px]' />}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <RemainingTasks schedules={todaySchedules} futureTimeSlots={futureTimeSlots} />
          <TaskPastDue schedules={todaySchedules} futureTimeSlots={futureTimeSlots} />
        </div>
      </div>

      <div className={`grid gap-6 items-start ${selectedAssignment ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <section className='bg-white border rounded-card border-line'>
          <div className='flex items-baseline justify-between px-6 pt-5 pb-4'>
            <div>
              <h2 className='text-lg font-semibold'>{currentDate.format('dddd, D MMMM')}</h2>
              <p className='mt-0.5 text-sm text-ink-3'>
                {isToday ? 'Today · ' : ''}{dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
            {!isToday && (
              <button onClick={() => setCurrentDate(dayjs())} className='h-8 px-3 text-sm font-medium border rounded-md border-line hover:bg-page'>Today</button>
            )}
          </div>

          <div className='max-h-[70vh] overflow-y-auto px-6 pb-5'>
            {isLoading ? (
              <p className='py-6 text-sm text-ink-3'>Loading…</p>
            ) : isToday ? (
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
            ) : filteredTimeSlots.length === 0 && isPastDate ? (
              <p className='py-6 text-sm text-ink-2'>Nothing was scheduled on this day.</p>
            ) : (
              filteredTimeSlots.map((slot, index) => (
                <HourRow
                  key={`time-slot-${index}`}
                  slot={slot}
                  onAdd={isFutureDate && !isAddingBySlot[slot] ? () => handleAddNewClick(slot) : null}
                >
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
                  {isFutureDate && isAddingBySlot[slot] && (
                    <AssignmentList
                      title={assignmentTitles[slot] || ''}
                      isEditing={true}
                      onLabelChange={(e) => handleTitleChange(slot, e.target.value)}
                      onSave={() => handleSaveNewAssignment(slot)}
                      cancelAdd={() => handleCancelAdd(slot)}
                    />
                  )}
                </HourRow>
              ))
            )}
          </div>
        </section>

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
  )
}

export default Schedule
