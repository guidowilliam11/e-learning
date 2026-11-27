'use client'

import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import {
  insertSchedule,
  updateScheduleCheckStatus,
} from '@/app/schedule/action'

import Link from 'next/link'
import { LuCheck, LuPlus } from 'react-icons/lu'

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

  // Every task today in time order; unchecked ones whose hour has passed are overdue.
  const items = [...todaySchedules].sort((a, b) => new Date(a.date) - new Date(b.date))
  const done = items.filter((s) => s.checked).length
  const nextSlot = futureTimeSlots[1] || futureTimeSlots[0]

  return (
    <section className='flex flex-col p-6 bg-white border rounded-card border-line'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Today</h3>
        <Link href='/schedule' className='text-sm font-medium text-accent hover:underline'>Open schedule</Link>
      </div>
      {items.length > 0 && (
        <div className='flex items-center gap-3 mt-3'>
          <div className='flex-1 h-1.5 rounded-full bg-line'>
            <div className='h-1.5 rounded-full bg-accent' style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
          <span className='text-xs text-ink-3 tnum'>{done}/{items.length} done</span>
        </div>
      )}

      <ul className='mt-4 -mx-2 list-none'>
        {items.length === 0 && <li className='px-2 text-sm text-ink-2'>No tasks yet. Add one for later today.</li>}
        {items.map((task) => {
          const overdue = !task.checked && dayjs(task.date).add(1, 'hour').isBefore(dayjs())
          return (
            <li key={task._id} className='flex items-center gap-3 px-2 py-2 rounded-md hover:bg-page'>
              <button
                role='checkbox'
                aria-checked={task.checked}
                aria-label={task.title}
                onClick={() => handleCheck(task._id)}
                className={`grid size-5 shrink-0 place-items-center rounded-full border ${task.checked ? 'bg-accent border-accent text-white' : 'border-zinc-300 hover:border-accent'}`}
              >
                {task.checked && <LuCheck size={12} strokeWidth={3} />}
              </button>
              <span className={`flex-1 min-w-0 text-sm truncate ${task.checked ? 'text-ink-3 line-through' : ''}`}>{task.title}</span>
              {overdue && <span className='px-1.5 py-0.5 text-[11px] font-medium rounded bg-red-50 text-red-700'>Overdue</span>}
              <span className='text-xs text-ink-3 tnum'>{dayjs(task.date).format('HH:mm')}</span>
            </li>
          )
        })}
      </ul>

      {nextSlot && (
        <div className='pt-3 mt-auto'>
          {isAddingBySlot[nextSlot] ? (
            <input
              autoFocus
              value={assignmentTitles[nextSlot] || ''}
              onChange={(e) => handleTitleChange(nextSlot, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNewAssignment(nextSlot)
                if (e.key === 'Escape') handleCancelAdd(nextSlot)
              }}
              placeholder={`Task at ${dayjs(nextSlot, 'hh:mm A').format('HH:mm')}, press Enter`}
              aria-label='New task title'
              className='w-full px-3 py-2 text-sm border rounded-md border-line focus:outline-none focus:border-accent'
            />
          ) : (
            <button onClick={() => handleAddNewClick(nextSlot)} className='flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-ink-2 rounded-md hover:bg-page hover:text-ink'>
              <LuPlus size={16} /> Add task
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default ToDoList
