import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import huHU from 'date-fns/locale/hu'
import enUS from 'date-fns/locale/en-US'

import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { add, addDays, endOfDay, startOfDay, startOfMonth } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { lang } from './utils'
import AddAssignment from './AddAssignment'
import React from 'react'
import apiClient from '../../services/apiClient'
import { User, useAuth, AssignmentsQuery, useAssignments, useDeleteAssignment, usePatchAssignment } from '../../hooks/hooks'
import { useLocation } from 'react-router-dom'
import ReportDetail from '../Reports/ReportDetail'
import { Report, dataOmit, useDeleteReport, usePatchReport, usePostReport, useReportPDF } from '../../hooks/useReports'
import { FaFilePdf } from "react-icons/fa";




type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarComponent = () => {

    const reportBg = useColorModeValue('#3bb143', '#0b6623')
    const eventBg = useColorModeValue('#e4cd05', '#ed7014')

    const eventStyleGetter = (event: any) => {
        let backgroundColor = '#' + event.hexColor;
        if (url.pathname == '/reports') {
            if (event.report) backgroundColor = reportBg;
            if (!event.report) backgroundColor = eventBg;
        } else {
            event.assignees.map((r: any) => r._id).includes(user._id) ? backgroundColor = '#0b6623' : ''
        }

        const style = {
            backgroundColor: backgroundColor,
            border: '0px',
        }
        return {
            style: style
        }
    }

    //for prop passing 
    const [inDuty, setInDuty] = useState([] as User[])
    const [value, setValue] = useState<Value[]>([new Date(), add(new Date(), { hours: 3 })]);
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const { onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)
    const [showAlert, setShowAlert] = useState(false)
    const [assigmentId, setAssigmentId] = useState('')


    const [report, setReport] = useState({} as Report)
    //

    const { i18n, t } = useTranslation('assignments')
    const { user } = useAuth()
    const url = useLocation()

    const calendarColor = useColorModeValue('#E2E8F0', '#4a5568')
    const todayColor = useColorModeValue('#daf0ff', '#004881')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const textColor = useColorModeValue('#000', '#fff')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const reset = () => {
        onClose()
        setInDuty([])
        setValue([new Date(), add(new Date(), { hours: 3 })])
        setTitle('')
        setLocation('')
        setReport({} as Report)
    }
    const toast = useToast()

    const queryClient = useQueryClient()

    const [period, setPeriod] = useState({ start: startOfMonth(new Date()).toISOString(), end: add(startOfMonth(new Date()).toISOString(), { months: 1, weeks: 1 }).toISOString(), orderBy: 'start', projection: 'full' } as AssignmentsQuery)

    useEffect(() => {
        if (url.pathname == '/reports') setPeriod({ ...period, end: endOfDay(new Date()).toISOString() })
    }, [])

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

    const onRangeChange = useCallback((range: any) => {
        if (!range.length) {
            if (url.pathname == '/assignments') setPeriod({ ...period, start: range.start.toISOString(), end: range.end.toISOString() })
            else setPeriod({ ...period, start: range.start.toISOString(), end: endOfDay(new Date()).toISOString() })
        } else if (range.length == 7) {
            if (url.pathname == '/reports') {
                let fetched = false
                for (let i = 0; i < 7; i++) {
                    if (range[i] > endOfDay(new Date()) && !fetched) {
                        setPeriod({ ...period, start: range[0].toISOString(), end: endOfDay(new Date()).toISOString() })
                        fetched = true
                    }
                }
                if (!fetched) setPeriod({ ...period, start: range[0].toISOString(), end: add(range[6], { days: 1 }).toISOString() })
            } else setPeriod({ ...period, start: range[0].toISOString(), end: add(range[6], { days: 1 }).toISOString() })
        } else if (range.length == 1) {
            if (url.pathname == '/reports') {
                if (range[0] > endOfDay(new Date())) setPeriod({ ...period, start: range[0].toISOString(), end: endOfDay(addDays(new Date(), -1)).toISOString() })
                else setPeriod({ ...period, start: startOfDay(range[0]).toISOString(), end: endOfDay(range[0]).toISOString() })
            }
        } else setPeriod({ ...period, start: startOfDay(range[0]).toISOString(), end: endOfDay(range[0]).toISOString() })
    }, [])

    const [canEdit, setCanEdit] = useState(true)
    const [hasReport, setHasReport] = useState(false)
    const onSelectEvent = useCallback((calEvent: any) => {
        if (url.pathname == '/reports') {
            setShowAlert(true)
            setAssigmentId(calEvent._id)
            setInDuty(calEvent.assignees)
            setHasReport(!(calEvent.report == undefined))
        } else {
            setAssigmentId(calEvent._id)
            setShowAlert(true)
            setInDuty(calEvent.assignees)
            setLocation(calEvent.location)
            setTitle(calEvent.title)
            setValue([calEvent.start, calEvent.end])
        }
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
                                {url.pathname == '/assignments' ? t('editAssignment') : t('saveReport')}
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                {url.pathname == '/assignments' &&
                                    <AddAssignment inDuty={inDuty} setInDuty={setInDuty} value={value} setValue={setValue} title={title} location={location}
                                        setTitle={setTitle} setLocation={setLocation} />
                                }
                                {url.pathname == '/reports' && <ReportDetail edit={canEdit} setCanEdit={setCanEdit} id={assigmentId} assignees={inDuty} report={report} setReport={setReport} />}
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                {(url.pathname == '/reports' && hasReport) &&
                                    <Button mr='auto' onClick={() => useReportPDF(assigmentId)} title={t('exportPdf')}>
                                        <Text color='#ff4d4d' m={0}><FaFilePdf /></Text>
                                    </Button>
                                }
                                <Button ref={cancelRef} onClick={() => {
                                    setShowAlert(false)
                                    reset()
                                }} >
                                    {t('common:cancel')}
                                </Button>

                                {(user.roles?.includes('president') || (url.pathname == '/reports' && inDuty.map(x => x._id).includes(user._id))) &&
                                    <Button colorScheme='red' isDisabled={(url.pathname == '/reports' && !hasReport) || !canEdit} title={!canEdit ? t('3dayError') : ''} onClick={() => {
                                        setShowAlert(false)
                                        reset()
                                        if (url.pathname == '/assignments') {
                                            useDeleteAssignment(assigmentId).then(() => {
                                                queryClient.refetchQueries(['assignments'])
                                                toast({
                                                    title: t('common:success'),
                                                    description: t('removedAssignment'),
                                                    status: 'success',
                                                    position: 'top',
                                                    colorScheme: 'green'
                                                })
                                            }).catch((err) =>
                                                toast({
                                                    title: t('common:error'),
                                                    description: err.response.data.message,
                                                    status: 'error',
                                                    position: 'top',
                                                    colorScheme: 'red'
                                                }))
                                        } else if (hasReport) {
                                            useDeleteReport(assigmentId).then(() => {
                                                queryClient.refetchQueries(['assignments'])
                                                toast({
                                                    title: t('common:success'),
                                                    description: t('removedAssignment'),
                                                    status: 'success',
                                                    position: 'top',
                                                    colorScheme: 'green'
                                                })
                                            }).catch((err) =>
                                                toast({
                                                    title: t('common:error'),
                                                    description: err.response.data.message,
                                                    status: 'error',
                                                    position: 'top',
                                                    colorScheme: 'red'
                                                }))
                                        }
                                        setReport({} as Report)
                                    }
                                    } ml={3}>
                                        {t('common:delete')}
                                    </Button>
                                }

                                {(user.roles?.includes('president') || (url.pathname == '/reports' && inDuty.map(x => x._id).includes(user._id))) &&
                                    <Button colorScheme='green' isDisabled={!canEdit} title={!canEdit ? t('3dayError') : ''} onClick={() => {
                                        if (url.pathname == '/assignments') {
                                            if (value instanceof Array) {
                                                usePatchAssignment(assigmentId, title, location, (value[0] as Date).toISOString(), (value[1] as Date).toISOString(), inDuty.map(x => x._id)).then(() => {
                                                    queryClient.refetchQueries(['assignments'])
                                                    toast({
                                                        title: t('common:success'),
                                                        description: t('modifiedAssignment'),
                                                        status: 'success',
                                                        position: 'top',
                                                        colorScheme: 'green'
                                                    })
                                                }).catch((err) =>
                                                    toast({
                                                        title: t('common:error'),
                                                        description: err.response.data.message,
                                                        status: 'error',
                                                        position: 'top',
                                                        colorScheme: 'red'
                                                    }))
                                            }
                                        }
                                        else {
                                            const data: dataOmit = {
                                                method: report.method, purpose: report.purpose, description: report.description,
                                                endKm: report.endKm, startKm: report.startKm, externalOrganization: report.externalOrganization,
                                                externalRepresentative: report.externalRepresentative, licensePlateNumber: report.licensePlateNumber
                                            }
                                            if (hasReport) {
                                                usePatchReport(assigmentId, data).then(() => {
                                                    queryClient.refetchQueries(['assignments'])
                                                    toast({
                                                        title: t('common:success'),
                                                        description: t('modifiedReport'),
                                                        status: 'success',
                                                        position: 'top',
                                                        colorScheme: 'green'
                                                    })
                                                }).catch((err) =>
                                                    toast({
                                                        title: t('common:error'),
                                                        description: err.response.data.message,
                                                        status: 'error',
                                                        position: 'top',
                                                        colorScheme: 'red'
                                                    }))
                                            }
                                            else if (report.method && report.purpose != '') {
                                                usePostReport(assigmentId, data).then(() => {
                                                    queryClient.refetchQueries(['assignments'])
                                                    toast({
                                                        title: t('common:success'),
                                                        description: t('createdReport'),
                                                        status: 'success',
                                                        position: 'top',
                                                        colorScheme: 'green'
                                                    })
                                                }).catch((err) =>
                                                    toast({
                                                        title: t('common:error'),
                                                        description: err.response.data.message,
                                                        status: 'error',
                                                        position: 'top',
                                                        colorScheme: 'red'
                                                    }))
                                            }
                                            setReport({} as Report)
                                        }
                                        setShowAlert(false)
                                    }} ml={3}>
                                        {t('common:save')}
                                    </Button>
                                }


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
            }} m={15} height={600} maxW='95vw'>
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
                    eventPropGetter={eventStyleGetter}
                />
            </Box>
        </>
    )
}

export default CalendarComponent