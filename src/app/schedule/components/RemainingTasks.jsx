const RemainingTasks = ({ done, total }) => {
  return (
    <div className='flex flex-col justify-between bg-[#545EE1] text-white rounded-lg p-6 h-[28%]'>
      <h2 className='mb-2 text-base font-normal'>
        Today&apos;s Remaining Tasks
      </h2>
      <p className='content-center flex-grow text-6xl font-medium text-start'>
        {done} / {total}
      </p>
    </div>
  )
}

export default RemainingTasks
