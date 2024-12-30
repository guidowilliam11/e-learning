import AssignmentList from './AssignmentList'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

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
}) => {
  const futureSchedules = schedules.filter(
    ({ timeSlot }) =>
      (parseInt(timeSlot) % 12) + (timeSlot.includes('PM') ? 12 : 0) >=
      currentDate.hour()
  )

  return (
    <>
      {futureTimeSlots.map((slot, index) => (
        <div key={`time-slot-${index}`}>
          <p className='mt-3 text-[#050505a8] text-lg'>{slot}</p>

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

          {isAddingBySlot[slot] ? (
            <AssignmentList
              title={assignmentTitles[slot] || ''}
              isEditing={true}
              onLabelChange={(e) => handleTitleChange(slot, e.target.value)}
              onSave={() => handleSaveNewAssignment(slot)}
              cancelAdd={() => handleCancelAdd(slot)}
            />
          ) : (
            <Button
              variant='text'
              startIcon={<AddIcon size={14} color='#050505a8' />}
              sx={{
                color: '#050505a8',
                textTransform: 'none',
                fontSize: '16px',
                ml: 0.75,
              }}
              onClick={() => handleAddNewClick(slot)}
            >
              Add new
            </Button>
          )}
        </div>
      ))}
    </>
  )
}

export default FutureSchedules
