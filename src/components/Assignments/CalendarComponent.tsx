import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import huHU from 'date-fns/locale/hu'
import enUS from 'date-fns/locale/en-US'

import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { add, endOfDay, startOfDay, startOfMonth } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { lang } from './utils'
import AddAssignment from './AddAssignment'
import React from 'react'
import apiClient from '../../services/apiClient'
import { User, useAuth, AssignmentsQuery, useAssignment, useAssignments, useDeleteAssignment, usePatchAssignment } from '../../hooks/hooks'

const CalendarComponent = () => {

    //for prop passing
    const [inDuty, setInDuty] = useState([] as User[])
    const [value, setValue] = useState<string[]>([new Date().toISOString(), add(new Date(), { hours: 3 }).toISOString()]);
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const { onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)
    const [showAlert, setShowAlert] = useState(false)
    const [assigmentId, setAssigmentId] = useState('')

    const { i18n, t } = useTranslation('assignments')
    const { user } = useAuth()

    const calendarColor = useColorModeValue('#E2E8F0', '#4a5568')
    const todayColor = useColorModeValue('#daf0ff', '#004881')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const textColor = useColorModeValue('#000', '#fff')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const reset = () => {
        onClose()
        setInDuty([])
        setValue([new Date().toISOString(), add(new Date(), { hours: 3 }).toISOString()])
        setTitle('')
        setLocation('')
    }
    const toast = useToast()

    const queryClient = useQueryClient()

    const [period, setPeriod] = useState({ start: startOfMonth(new Date()).toISOString(), end: add(startOfMonth(new Date()).toISOString(), { months: 1, weeks: 1 }).toISOString(), orderBy: 'start', projection: 'full' } as AssignmentsQuery)
    const { data } = useAssignments(period)


    apiClient.interceptors.response.use(res => {
        if (!res.data.items) return res
        res.data.items = res.data.items.map((item: any) => ({
            ...item,
            start: new Date(item.start),
            end: new Date(item.end)
        }))
        return res
    })

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


    useAssignment(assigmentId)

    const onRangeChange = useCallback((range: any) => {
        if (!range.length) {
            setPeriod({ ...period, start: range.start.toISOString(), end: range.end.toISOString() })
        } else if (range.length == 7) {
            setPeriod({ ...period, start: range[0].toISOString(), end: add(range[6], { days: 1 }).toISOString() })
        } else if (range.length == 1) {
            setPeriod({ ...period, start: startOfDay(range[0]), end: endOfDay(range[0]) })
        }
    }, [])

    const onSelectEvent = useCallback((calEvent: any) => {
        setShowAlert(true)
        setAssigmentId(calEvent._id)
        setInDuty(calEvent.assignees)
        setLocation(calEvent.location)
        setTitle(calEvent.title)
        setValue([calEvent.start, calEvent.end])

    }, [])

    return (
        <>
            {showAlert &&
                <AlertDialog
                    isOpen={true}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    closeOnEsc={true}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                {t('editAssignment')}
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                <AddAssignment inDuty={inDuty} setInDuty={setInDuty} value={value} setValue={setValue} title={title} location={location}
                                    setTitle={setTitle} setLocation={setLocation} />
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => {
                                    setShowAlert(false)
                                    reset()
                                }} >
                                    {t('common:cancel')}
                                </Button>

                                {user.roles?.includes('president') &&
                                    <Button colorScheme='red' onClick={() => {
                                        setShowAlert(false)
                                        reset()
                                        useDeleteAssignment(assigmentId).then(() => {
                                            queryClient.refetchQueries(['assignments'])
                                            toast({
                                                title: t('common:success'),
                                                description: t('removedAssignment'),
                                                status: 'success',
                                                position: 'top',
                                                colorScheme: 'green'
                                            })
                                        })
                                    }} ml={3}>
                                        {t('common:delete')}
                                    </Button>
                                }

                                <Button colorScheme='green' onClick={() => {
                                    if (value instanceof Array) {
                                        usePatchAssignment(assigmentId, title, location, value[0], value[1], inDuty.map(x => x._id)).then(() => {
                                            queryClient.refetchQueries(['assignments'])
                                            toast({
                                                title: t('common:success'),
                                                description: t('modifiedAssignment'),
                                                status: 'success',
                                                position: 'top',
                                                colorScheme: 'green'
                                            })
                                        })
                                    }
                                    setShowAlert(false)
                                }} ml={3}>
                                    {t('common:save')}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog >
            }
            <Box sx={{
                '.rbc-off-range-bg': { bg: calendarColor }, '.rbc-today': { bg: todayColor },
                '.rbc-toolbar button.rbc-active': { bg: buttonBg, color: buttonColor, '&:hover': { bg: buttonHover } },
                '.rbc-toolbar button:hover': { bg: buttonHover, color: buttonColor },
                '.rbc-toolbar button:focus': { bg: buttonBg, color: buttonColor }, '.rbc-toolbar button': { color: textColor },
            }} my={15} mx={2} height={600} maxW='95vw'>
                <Calendar
                    localizer={localizer}
                    onRangeChange={onRangeChange}
                    startAccessor="start"
                    endAccessor="end"
                    step={60}
                    events={data?.items}
                    messages={i18n.language == 'hu' ? lang['hu'] : lang['en']}
                    views={['month', 'week', 'day']}
                    culture={i18n.language == 'hu' ? 'hu-HU' : 'en-US'}
                    onSelectEvent={onSelectEvent}
                    showAllEvents={true}
                />
            </Box>
        </>
    )
}

export default CalendarComponent