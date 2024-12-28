const TaskPastDue = ({ schedules, futureTimeSlots }) => {
  const totalTaskPast = schedules.filter(
    (schedule) => !futureTimeSlots.includes(schedule.timeSlot)
  ).length

  return (
    <div className='flex flex-col justify-between bg-white text-black rounded-lg p-6 h-[25.5%] mt-4'>
      <h2 className='mb-2 text-base font-normal'>Task Past Due</h2>
      <p className='content-center flex-grow text-6xl font-medium text-start'>
        {totalTaskPast}
      </p>
    </div>
  )
}

export default TaskPastDue
