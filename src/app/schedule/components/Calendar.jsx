'use client'

import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Calendar = ({ currentDate, setCurrentDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        sx={{
          m: 0,
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: '#E0E7FF', // Light purple
            color: 'black',
          },
          '& .MuiPickersDay-root': {
            fontWeight: '600',
            fontSize: '14px',
          },
        }}
        value={currentDate}
        onChange={(newValue) => setCurrentDate(newValue)}
      />
    </LocalizationProvider>
  )
}

export default Calendar
