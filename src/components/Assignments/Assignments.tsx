import React, { useState } from 'react'
import CalendarComponent from './CalendarComponent'
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useDisclosure, useColorModeValue, Stack, useToast } from '@chakra-ui/react'
import { useAuth } from '../../hooks/hooks'
import AddAssignment from './AddAssignment'
import { User } from '../../hooks/useLogin'

import { usePostAssignment } from '../../hooks/useAssignments'
import { useQueryClient } from '@tanstack/react-query'
import { add } from 'date-fns'


const Assignments = () => {

    const { user } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)
    const toast = useToast()
    const queryClient = useQueryClient()

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    //for prop passing
    const [inDuty, setInDuty] = useState([] as User[])
    const [value, setValue] = useState<string[]>([new Date().toISOString(), add(new Date(), { hours: 3 }).toISOString()]);
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')

    const reset = () => {
        onClose()
        setInDuty([])
        setValue([new Date().toISOString(), add(new Date(), { hours: 3 }).toISOString()])
        setTitle('')
        setLocation('')
    }

    return (
        <div>
            <CalendarComponent />
            {user.roles?.includes('president') &&
                <Stack alignItems='center' mt={10}>
                    <Button width={250} backgroundColor={buttonBg} color={buttonColor} _hover={{ backgroundColor: buttonHover }} onClick={onOpen}>Beosztás felvétele</Button>
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
                            Beosztás rögzítése
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <AddAssignment inDuty={inDuty} setInDuty={setInDuty} value={value} setValue={setValue} title={title} location={location}
                                setTitle={setTitle} setLocation={setLocation} />
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => {
                                reset()
                            }}>
                                Mégse
                            </Button>
                            <Button colorScheme='green' onClick={() => {
                                reset()
                                if (value instanceof Array) {
                                    const start = value[0]
                                    const end = value[1]
                                    const assignees = inDuty.map(x => x._id)

                                    usePostAssignment(title || 'Általános szolgálat', location || 'Nem megadott', start, end, assignees).then(() => {
                                        queryClient.refetchQueries(['assignments'])
                                        toast({
                                            title: 'Sikeres létrehozás',
                                            description: 'A szolgálat sikeresen rögzítve lett',
                                            status: 'success',
                                            position: 'top',
                                            colorScheme: 'green'
                                        })
                                    })
                                }
                            }} ml={3}>
                                Rögzítés
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div >
    )
}

export default Assignments