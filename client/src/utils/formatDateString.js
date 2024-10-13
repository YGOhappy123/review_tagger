import dayjs from 'dayjs'
import 'dayjs/locale/en'

const formatDateString = (dateString) => {
    return dayjs(dateString).locale('en').format('D MMMM, YYYY')
}

const formatDateTimeString = (dateString) => {
    return dayjs(dateString).locale('en').format('D MMMM, YYYY - HH:mm:ss')
}

export { formatDateString, formatDateTimeString }
