import React, { useEffect, useState } from 'react'
import CalendarComponent from './CalendarComponent'
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useDisclosure, useColorModeValue, Stack, useToast, Heading, Box, HStack, Text } from '@chakra-ui/react'
import { useAuth, User, usePostAssignment } from '../../hooks/hooks'
import AddAssignment from './AddAssignment'

import { useQueryClient } from '@tanstack/react-query'
import { add } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Assignments = () => {

    const [valid, setValid] = useState(true)

    useEffect(() => {
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])

    const { user } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)
    const toast = useToast()
    const queryClient = useQueryClient()

    const { t } = useTranslation('assignments')

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    //for prop passing
    const [inDuty, setInDuty] = useState([] as User[])
    const [value, setValue] = useState<Value[]>([new Date(), add(new Date(), { hours: 3 })]);
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')

    const reset = () => {
        onClose()
        setInDuty([])
        setValue([new Date(), add(new Date(), { hours: 3 })])
        setTitle('')
        setLocation('')
    }


    if (!valid) return <Navigate to='/login' />

    return (
        <div>
            <CalendarComponent />
            <HStack>
                <Box borderRadius='50%' backgroundColor='#0b6623' height={4} w={4} m={5} />
                <Text m={0} fontWeight='bold'>- Szolgálatba osztva.</Text>
            </HStack>
            {user?.roles?.includes('president') &&
                <Stack alignItems='center' mt={10}>
                    <Button width={250} backgroundColor={buttonBg} color={buttonColor} _hover={{ backgroundColor: buttonHover }} onClick={onOpen}>{t('addAssignment')}</Button>
                </Stack>
            }




            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                closeOnEsc={true}
            >
                <AlertDialogOverlay >
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {t('addAssignment')}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <AddAssignment inDuty={inDuty} setInDuty={setInDuty} value={value} setValue={setValue} title={title} location={location}
                                setTitle={setTitle} setLocation={setLocation} />
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => {
                                reset()
                            }}>
                                {t('common:cancel')}
                            </Button>
                            <Button colorScheme='green' onClick={() => {
                                reset()
                                if (value instanceof Array) {
                                    const start = value[0]
                                    const end = value[1]
                                    const assignees = inDuty.map(x => x._id)

                                    usePostAssignment(title || 'Általános szolgálat', location || 'Nem megadott', (start as Date).toISOString(), (end as Date).toISOString(), assignees).then(() => {
                                        queryClient.refetchQueries(['assignments'])
                                        toast({
                                            title: t('common:success'),
                                            description: t('addedAssignment'),
                                            status: 'success',
                                            position: 'top',
                                            colorScheme: 'green'
                                        })
                                    })
                                }
                            }} ml={3}>
                                {t('common:save')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div >
    )
}

export default Assignments