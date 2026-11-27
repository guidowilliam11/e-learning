const TaskPastDue = ({ schedules, futureTimeSlots }) => {
  const overdue = schedules.filter(
    (schedule) => !futureTimeSlots.includes(schedule.timeSlot) && !schedule.checked
  ).length

  return (
    <div className='p-5 bg-white border rounded-card border-line'>
      <p className='text-xs text-ink-3'>Past due</p>
      <p className={`mt-1 text-2xl font-semibold tnum ${overdue ? 'text-red-700' : ''}`}>{overdue}</p>
    </div>
  )
}

export default TaskPastDue
