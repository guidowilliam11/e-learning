import AssignmentList from './AssignmentList'
import { LuPlus } from 'react-icons/lu'
import dayjs from 'dayjs'

// One row per hour, like a calendar day view: the hour on the left, its tasks on the right.
// Empty hours keep a quiet "Add" that shows on hover or keyboard focus.
export const HourRow = ({ slot, now, children, onAdd }) => (
  <div className={`grid grid-cols-[64px_1fr] gap-3 border-t border-line group/slot ${now ? 'relative' : ''}`}>
    <p className={`pt-2 text-xs tnum ${now ? 'font-semibold text-accent' : 'text-ink-3'}`}>{dayjs(slot, 'hh:mm A').format('HH:mm')}</p>
    <div className='min-h-[44px] py-1'>
      {children}
      {onAdd && (
        <button
          onClick={onAdd}
          className='flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded text-ink-3 opacity-0 group-hover/slot:opacity-100 focus:opacity-100 hover:text-accent'
        >
          <LuPlus size={14} /> Add task
        </button>
      )}
    </div>
  </div>
)

const FutureSchedules = ({
  currentDate,
  schedules,
  futureTimeSlots,
  assignmentTitles,
  isAddingBySlot,
  handleCheck,
  handleViewAssignment,
  handleAddNewClick,
  handleTitleChange,
  handleSaveNewAssignment,
  handleCancelAdd,
}) => {
  const futureSchedules = schedules.filter(
    ({ timeSlot }) =>
      (parseInt(timeSlot) % 12) + (timeSlot.includes('PM') ? 12 : 0) >=
      currentDate.hour()
  )

  return (
    <>
      {futureTimeSlots.map((slot, index) => (
        <HourRow key={`time-slot-${index}`} slot={slot} now={index === 0} onAdd={isAddingBySlot[slot] ? null : () => handleAddNewClick(slot)}>
          {futureSchedules
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
          {isAddingBySlot[slot] && (
            <AssignmentList
              title={assignmentTitles[slot] || ''}
              isEditing={true}
              onLabelChange={(e) => handleTitleChange(slot, e.target.value)}
              onSave={() => handleSaveNewAssignment(slot)}
              cancelAdd={() => handleCancelAdd(slot)}
            />
          )}
        </HourRow>
      ))}
    </>
  )
}

export default FutureSchedules
