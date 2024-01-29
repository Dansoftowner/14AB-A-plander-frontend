import React, { useState } from 'react'
import CalendarComponent from './CalendarComponent'
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useDisclosure, useColorModeValue, Stack } from '@chakra-ui/react'
import { useAuth } from '../../hooks/hooks'
import AddAssignment from './AddAssignment'
import { User } from '../../hooks/useLogin'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Assignments = () => {

    const { user } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    //for prop passing
    const [inDuty, setInDuty] = useState([] as User[])

    const [value, setValue] = useState<Value>(new Date());


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
                            <AddAssignment inDuty={inDuty} setInDuty={setInDuty} value={value} setValue={setValue} />
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => {
                                onClose()
                                setInDuty([])
                                setValue(new Date())
                            }}>
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