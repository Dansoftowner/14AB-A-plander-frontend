import React from 'react'
import CalendarComponent from './CalendarComponent'
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useDisclosure, useColorModeValue, Stack } from '@chakra-ui/react'
import { useAuth } from '../../hooks/hooks'
import AddAssignment from './AddAssignment'

const Assignments = () => {

    const { user } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')


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
                            <AddAssignment />
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Mégse
                            </Button>
                            <Button colorScheme='green' onClick={onClose} ml={3}>
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