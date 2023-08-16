import { format, subDays } from 'date-fns'

const today = new Date()
const todayFormat = format(today, 'yyyy-MM-dd')

const filtros = [
    {
        label: 'Últimos 7 días',
        startAt: format(subDays(today, 7), 'yyyy-MM-dd'),
        endAt: todayFormat,
    },
    {
        label: 'Últimos 28 días',
        startAt: format(subDays(today, 28), 'yyyy-MM-dd'),
        endAt: todayFormat,
    },
]

console.log(filtros)
