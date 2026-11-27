const RemainingTasks = ({ schedules, futureTimeSlots }) => {
  const upcoming = schedules.filter((schedule) => futureTimeSlots.includes(schedule.timeSlot))
  const remaining = upcoming.filter((schedule) => !schedule.checked).length

  return (
    <div className='p-5 bg-white border rounded-card border-line'>
      <p className='text-xs text-ink-3'>Left today</p>
      <p className='mt-1 text-2xl font-semibold tnum'>
        {remaining}<span className='text-base font-normal text-ink-3'> of {upcoming.length}</span>
      </p>
    </div>
  )
}

export default RemainingTasks
