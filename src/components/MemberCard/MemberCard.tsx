import { Box, HStack, VStack, Text, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure, Input, InputGroup, InputRightElement, useColorModeValue, Icon } from '@chakra-ui/react'
import { FaUserAlt, FaTrash } from "react-icons/fa";
import { MdOutlineWarning } from "react-icons/md";
import useAuth from '../../hooks/useAuth';
import { useRef, useState } from 'react';
import { useRemoveMember } from '../../hooks/useMembers';
import { useQueryClient } from '@tanstack/react-query';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
    name: string;
    email: string;
    phone: string;
    isRegistered: boolean;
    _id: string;
}

const MemberCard = ({ email, name, phone, _id, isRegistered }: Props) => {
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const { user } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { t } = useTranslation('register')
    const cancelRef = useRef<HTMLButtonElement>(null)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [confirmError, setConfirmError] = useState('')

    const [show, setShow] = useState(false)
    const isVisible = () => (show ? <IoMdEyeOff /> : <IoMdEye />)

    const removeMember = (_id: string) => {
        useRemoveMember(_id, password).then(res => {
            if (res.status === 200) {
                queryClient.refetchQueries()
                onClose()
                setConfirmError('')
            }
        }).catch(err => {
            setConfirmError(err.response.data.message)
        })
    }

    const detailNavigator = () => {
        navigate('/member/' + _id, {
            state: { id: _id }
        })
    }

    const bodyColor = useColorModeValue('#ffffff', '#1A202C')
    const iconColor = useColorModeValue('#000', '#fff')
    const borderColor = useColorModeValue('#000', '#fff')

    return (
        <VStack mt={55} w={350} h={400} mx='auto' boxShadow={
            isRegistered ? 'dark-lg' : 'rgba(255, 165, 0, 0.1) 0px 0px 0px 1px, rgba(255, 165, 0, 0.2) 0px 5px 10px, rgba(255, 165, 0, 0.4) 0px 15px 40px'
        }
            border={!isRegistered ? 'orange 1px solid' : ''} borderRadius={10} padding={4}>

            <Box mt={5} backgroundColor={borderColor} border='1px solid' borderColor={borderColor} position='absolute' top={64} padding={65} borderRadius='50%' />
            <Box boxShadow='dark-lg' backgroundColor={bodyColor} alignItems='center' justifyContent='center' border='1px solid white' position='absolute' top={64} mt={6} width='fit-content' h='fit-content' padding={25} borderRadius='50%' onClick={detailNavigator} _hover={{ cursor: 'pointer' }}>
                <Icon as={FaUserAlt} color={iconColor} fontSize={72} />
            </Box>

            <VStack title={!isRegistered ? t('notRegistered') : ''} mt={32} alignContent='center' textAlign='center' onClick={detailNavigator} _hover={{ cursor: 'pointer' }}>
                <HStack>
                    <Text width={100} textAlign='start' margin={1}><b>{t('fullname')}:</b></Text>
                    <Text maxW='70vw' textAlign='start' w={200} margin={1}>{name}</Text>
                </HStack>
                <HStack>
                    <Text textAlign='start' width={100} maxW='70vw' margin={1}><b>{t('email')}:</b> </Text>
                    <Text textAlign='start' maxW='70vw' w={200} margin={1}>{email}</Text>
                </HStack>
                <HStack>
                    <Text textAlign='start' width={100} maxW='70vw' margin={1}><b>{t('phone')}:</b></Text>
                    <Text maxW='70vw' textAlign='start' w={200} margin={1}>{phone}</Text>
                </HStack>
                {user?.roles.includes('president') &&
                    <Box mt={5}>
                        <HStack>
                            <Button onClick={onOpen} fontSize={20} backgroundColor='transparent' _hover={{ backgroundColor: 'transparent', fontSize: 24, transition: '.1s ease-out' }}>
                                <Text margin={0} color='red'><FaTrash /></Text>
                            </Button>


                            {/* removing member alert */}

                            <AlertDialog
                                isOpen={isOpen}
                                onClose={onClose}
                                leastDestructiveRef={cancelRef}
                                isCentered={true}
                            >
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                            {t('removeUser')}
                                        </AlertDialogHeader>

                                        <AlertDialogBody>
                                            {t('pwdToDelete')}
                                            <InputGroup my={2}>
                                                <Input type={show ? 'text' : 'password'} onChangeCapture={(e) => setPassword((e.target as HTMLInputElement).value)} />
                                                <InputRightElement width="4.5rem">
                                                    <Button backgroundColor='transparent' h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                                        {isVisible()}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            {confirmError && <Text color='red'>{confirmError}</Text>}
                                            <Link to='/forgotten-password'><Text fontStyle='italic' h={3} _hover={{ color: buttonBg, fontSize: 17, transition: '0.3s ease-in-out' }}>{t('login:forgotMyPassword')}</Text></Link>
                                        </AlertDialogBody>

                                        <AlertDialogFooter>
                                            <Button onClick={() => {
                                                setConfirmError('')
                                                onClose()
                                            }}>
                                                {t('common:cancel')}
                                            </Button>
                                            <Button colorScheme='red' onClick={() => {
                                                if (password) {
                                                    removeMember(_id)
                                                }
                                            }} ml={3}>
                                                {t('kick')}
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </HStack>
                    </Box>
                }
            </VStack>



        </VStack >
    )
}

export default MemberCard