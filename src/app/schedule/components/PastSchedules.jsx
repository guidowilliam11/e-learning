import AssignmentList from './AssignmentList'
import { HourRow } from './FutureSchedules'
import { LuChevronRight } from 'react-icons/lu'

const PastSchedules = ({
  currentDate,
  schedules,
  timeSlots,
  handleCheck,
  handleViewAssignment,
}) => {
  const pastSchedules = schedules.filter(
    ({ timeSlot }) =>
      (parseInt(timeSlot) % 12) + (timeSlot.includes('PM') ? 12 : 0) <
      currentDate.hour()
  )

  const pastTimeSlots = timeSlots.filter(
    (slot) =>
      (parseInt(slot) % 12) + (slot.includes('PM') ? 12 : 0) <
        currentDate.hour() &&
      schedules.some(({ timeSlot }) => timeSlot === slot)
  )

  if (pastSchedules.length === 0) return null

  return (
    <details className='mb-2 group/past'>
      <summary className='flex items-center gap-1.5 py-2 text-sm font-medium list-none cursor-pointer text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden'>
        <LuChevronRight size={16} className='transition-transform group-open/past:rotate-90' />
        Earlier today <span className='text-ink-3 tnum'>· {pastSchedules.filter((s) => s.checked).length}/{pastSchedules.length} done</span>
      </summary>
      {pastTimeSlots.map((slot, index) => (
        <HourRow key={`time-slot-${index}`} slot={slot}>
          {pastSchedules
            .filter((schedule) => schedule.timeSlot === slot)
            .map((assignment) => (
              <AssignmentList
                key={`assignment-${assignment._id}`}
                curr={assignment._id}
                assignmentId={assignment.assignmentId}
                title={assignment.title.toString()}
                checked={assignment.checked}
                handleCheck={handleCheck}
                handleViewAssignment={handleViewAssignment}
              />
            ))}
        </HourRow>
      ))}
    </details>
  )
}

export default PastSchedules
