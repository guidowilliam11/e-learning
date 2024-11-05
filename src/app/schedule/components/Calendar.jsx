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
            color: '#1E3A8A', // Dark blue
          },
          '& .MuiPickersDay-root': {
            fontWeight: 'normal',
          },
        }}
        value={currentDate}
        onChange={(newValue) => setCurrentDate(newValue)}
      />
    </LocalizationProvider>
  )
}

export default Calendar
