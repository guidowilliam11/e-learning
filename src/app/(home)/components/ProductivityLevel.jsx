const ProductivityLevel = ({ schedules, futureTimeSlots }) => {
  const filteredSchedules = schedules.filter((schedule) =>
    futureTimeSlots.includes(schedule.timeSlot)
  )

  const remainingTasks = filteredSchedules.filter(
    (schedule) => schedule.checked
  ).length
  const totalTasks = filteredSchedules.length
  return (
    <div className='flex flex-col items-start justify-between p-4 text-center bg-white rounded-lg shadow-md h-1/2'>
      <h2 className='mb-5 text-lg font-semibold'>Productivity Level</h2>
      <p className='content-center flex-grow text-6xl font-bold text-start'>
        {remainingTasks} / {totalTasks}
      </p>
    </div>
  )
}

export default ProductivityLevel
