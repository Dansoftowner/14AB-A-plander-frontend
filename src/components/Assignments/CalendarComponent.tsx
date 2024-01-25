import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { AssignmentsQuery, useAssignments } from '../../hooks/useAssignments'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import huHU from 'date-fns/locale/hu'
import enUS from 'date-fns/locale/en-US'
import { Box, useColorModeValue } from '@chakra-ui/react'
import { add } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { lang } from './utils'


const CalendarComponent = () => {

    const { i18n } = useTranslation()

    const calendarColor = useColorModeValue('#E2E8F0', '#4a5568')
    const todayColor = useColorModeValue('#daf0ff', '#004881')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const textColor = useColorModeValue('#000', '#fff')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')


    const [valid, setValid] = useState(true)
    const queryClient = useQueryClient()
    useEffect(() => {
        queryClient.removeQueries(['assignments'])
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])

    const locales = {
        'hu-HU': huHU,
        'en-US': enUS
    }

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales
    })

    const [period, setPeriod] = useState({ start: new Date().toISOString(), end: add(new Date().toISOString(), { months: 1 }).toISOString(), orderBy: 'title', projection: 'full' } as AssignmentsQuery)
    const { data: events } = useAssignments(period)

    const onRangeChange = useCallback((range: any) => {
        if (!range.length) {
            setPeriod({ ...period, start: range.start.toISOString(), end: range.end.toISOString() })
        } else if (range.length == 7) {
            setPeriod({ ...period, start: range[0].toISOString(), end: range[6].toISOString() })
        } else if (range.length == 1) {
            setPeriod({ ...period, start: range[0].toISOString(), end: range[0].toISOString() })
        }
    }, [])

    if (valid) return (
        <>
            <Box sx={{
                '.rbc-off-range-bg': { bg: calendarColor }, '.rbc-today': { bg: todayColor },
                '.rbc-toolbar button.rbc-active': { bg: buttonBg, color: buttonColor, '&:hover': { bg: buttonHover } },
                '.rbc-toolbar button:hover': { bg: buttonHover, color: buttonColor },
                '.rbc-toolbar button:focus': { bg: buttonBg, color: buttonColor }, '.rbc-toolbar button': { color: textColor },
            }} margin={15} height={600} maxW='95vw'>
                <Calendar
                    localizer={localizer}
                    onRangeChange={onRangeChange}
                    startAccessor="start"
                    endAccessor="end"
                    step={60}
                    events={events?.items}
                    messages={i18n.language == 'hu' ? lang['hu'] : lang['en']}
                    views={['month', 'week', 'day']}
                    culture={i18n.language == 'hu' ? 'hu-HU' : 'en-US'}
                />
            </Box>
        </>
    )
}

export default CalendarComponent