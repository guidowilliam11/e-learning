'use client'

import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Calendar = ({ currentDate, setCurrentDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        sx={{
          m: 0,
          width: '100%',
          '.MuiPickersDay-root': { fontFamily: 'Inter', fontSize: 13 },
          '.MuiPickersDay-root.Mui-selected, .MuiPickersDay-root.Mui-selected:hover, .MuiPickersDay-root.Mui-selected:focus': {
            backgroundColor: '#4F55DA',
            color: '#fff',
          },
          '.MuiPickersDay-today:not(.Mui-selected)': { borderColor: '#4F55DA' },
          '.MuiPickersCalendarHeader-label': { fontWeight: 600, fontSize: 14 },
        }}
        value={currentDate}
        onChange={(newValue) => setCurrentDate(newValue)}
      />
    </LocalizationProvider>
  )
}

export default Calendar
