import dayjs from 'dayjs'

const MS_TO_SECOND = 1000
const MS_TO_MINUTE = MS_TO_SECOND * 60
const MS_TO_HOUR = MS_TO_MINUTE * 60
const MS_TO_DAY = MS_TO_HOUR * 24

export const getTimeDifferenceInDays = (time2, time1) => {
    return Math.floor((time2 - time1) / MS_TO_DAY)
}

export const formatTime = (time, options, separator = '/') => {
    const format = (option) => {
        const f = new Intl.DateTimeFormat('en-US', option)
        return f.format(time)
    }
    return options.map(format).join(separator)
}

export const formatMessageTime = (lastMessageTime, shouldShowTime = false) => {
    const epoch = new Date(lastMessageTime)
    const now = new Date()
    const options = []
    if (getTimeDifferenceInDays(now, epoch) > 0) {
        options.push({ year: 'numeric' }, { month: '2-digit' }, { day: '2-digit' })
        return formatTime(epoch, options, '/')
    } else if (
        shouldShowTime ||
        getTimeDifferenceInDays(now, epoch) === 0
    ) {
        options.push({ timeStyle: 'short', hour12: false })
        return formatTime(epoch, options, ':')
    }
}

export const formattedDate = (date) => {
    return date.format('ddd MMM DD YYYY')
}

export const formatHour = (hour) => {
    return dayjs().hour(hour).minute(0).format('hh:mm A')
}

export const generateTimeSlots = () => {
    return Array.from({ length: 23 - 0 + 1 }, (_, index) => {
        const hour = 0 + index
        return formatHour(hour)
    })
}
