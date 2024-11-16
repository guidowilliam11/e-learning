'use client'

import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Calendar = ({ currentDate, setCurrentDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        sx={{
          m: 0,
          '.Mui-selected': {
            backgroundColor: '#CBD5F7 !important',
            color: '#000000',
          },
          '.Mui-selected:hover': {
            backgroundColor: '#A3B5E0 !important',
          },
          '.MuiPickersDay-root.Mui-selected': {
            backgroundColor: '#CBD5F7 !important',
            color: '#000000',
          },
        }}
        value={currentDate}
        onChange={(newValue) => setCurrentDate(newValue)}
      />
    </LocalizationProvider>
  )
}

export default Calendar
