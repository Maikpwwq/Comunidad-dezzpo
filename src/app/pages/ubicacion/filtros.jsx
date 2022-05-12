today = new Date()
todayFormat = format(today, 'yyyy-MM-dd')

filtros = [
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
