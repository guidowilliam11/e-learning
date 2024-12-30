import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import AssignmentList from './AssignmentList'

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

  return (
    <>
      {pastSchedules.length > 0 && (
        <Accordion
          disableGutters
          sx={{
            boxShadow: 'none',
            border: 'none',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ArrowForwardIosSharpIcon
                sx={{
                  fontSize: '0.9rem',
                  transition: 'transform 0.3s ease',
                }}
              />
            }
            aria-controls='panel1-content'
            id='panel1-header'
            sx={{
              p: 0,
              flexDirection: 'row-reverse',
              '& .MuiAccordionSummary-expandIconWrapper': {
                transition: 'transform 0.3s ease',
              },
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)',
              },
              '& .MuiAccordionSummary-content': {
                my: 0,
                marginLeft: 1,
                p: 0,
              },
            }}
          >
            <h3 className='text-[#050505a8] text-lg'>Past Schedules</h3>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {pastTimeSlots.length > 0 && (
              <div>
                {pastTimeSlots.map((slot, index) => (
                  <div key={`time-slot-${index}`}>
                    <p className='text-[#050505a8] text-lg'>{slot}</p>

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
                  </div>
                ))}
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}

export default PastSchedules
