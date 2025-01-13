'use client'

import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { redirect } from 'next/navigation'

import {
  insertSchedule,
  updateScheduleCheckStatus,
} from '@/app/schedule/action'

import FutureSchedules from '@/app/schedule/components/FutureSchedules'

dayjs.extend(customParseFormat)

const ToDoList = ({
  user,
  currentDate,
  futureTimeSlots,
  todaySchedules,
  fetchSchedule,
}) => {
  const [assignmentTitles, setAssignmentTitles] = useState({})
  const [isAddingBySlot, setIsAddingBySlot] = useState({})

  const handleCheck = (id) => {
    try {
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (id) {
            const currentSchedule = todaySchedules.find(
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
            return 'To-Do List check update success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'To-Do List check update failed!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
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

  const handleTitleChange = (slot, value) => {
    setAssignmentTitles((prev) => ({
      ...prev,
      [slot]: value,
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
      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          if (assignmentTitles[slot].trim() !== '') {
            const newAssignment = {
              title: assignmentTitles[slot],
              checked: false,
              timeSlot: slot,
            }

            // Parse time slot
            const currentTimeSlot = dayjs(slot, 'hh:mm A')

            console.log(currentTimeSlot, slot)

            const combinedDateTime = dayjs(currentDate)
              .hour(currentTimeSlot.hour())
              .minute(currentTimeSlot.minute())
              .second(0)
              .toISOString()

            console.log(combinedDateTime, currentDate)

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
            return 'Insert new To-Do List success!'
          },
          autoClose: 2000,
        },
        error: {
          render() {
            return 'Insert new To-Do List failed!'
          },
          autoClose: 2000,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleViewAssignment = (id) => {
    redirect(`/schedule?assignmentId=${id}`)
  }

  return (
    <div className='p-4 overflow-y-auto bg-white rounded-lg shadow-md h-2/3'>
      <h2 className='mb-4 text-lg font-semibold'>Today&apos;s To-Do List</h2>

      <div className='space-y-4'>
        <FutureSchedules
          currentDate={currentDate}
          schedules={todaySchedules}
          futureTimeSlots={futureTimeSlots}
          assignmentTitles={assignmentTitles}
          isAddingBySlot={isAddingBySlot}
          handleCheck={handleCheck}
          handleAddNewClick={handleAddNewClick}
          handleTitleChange={handleTitleChange}
          handleSaveNewAssignment={handleSaveNewAssignment}
          handleViewAssignment={handleViewAssignment}
          handleCancelAdd={handleCancelAdd}
        />
      </div>
    </div>
  )
}

export default ToDoList
