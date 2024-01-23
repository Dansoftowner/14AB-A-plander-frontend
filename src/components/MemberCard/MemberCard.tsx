import { Box, HStack, Stack, VStack, Text, Button, Show, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure, Input, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react'
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

    return (
        <HStack direction='column' maxW='95vw' border='1px solid' borderRadius={4} padding={4} margin={2}>
            <Show above='lg'>
                <Stack width={55} onClick={detailNavigator} _hover={{ cursor: 'pointer' }}>
                    <Text fontSize={40}><FaUserAlt /></Text>
                </Stack>
            </Show>
            <VStack textAlign='start' onClick={detailNavigator} _hover={{ cursor: 'pointer' }}>
                <HStack>
                    <Text width={isRegistered ? 400 : 370} maxW={isRegistered ? '70vw' : '64vw'} margin={1}><b>{t('fullname')}:</b> {name}</Text>
                    {isRegistered == false && <Box color='orange' title={t('notRegistered')}><MdOutlineWarning /></Box>}
                </HStack>
                <Text width={400} maxW='70vw' margin={1}><b>{t('email')}:</b> {email}</Text>
                <Text width={400} maxW='70vw' margin={1}><b>{t('phone')}:</b> {phone}</Text>
            </VStack>
            {user?.roles.includes('president') &&
                <Box ml='auto'>
                    <Box>
                        <Button onClick={onOpen} fontSize={20} backgroundColor='transparent' _hover={{ backgroundColor: 'transparent', fontSize: 24, transition: '.1s ease-out' }}>
                            <Text margin={0} color='red'><FaTrash /></Text>
                        </Button>

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
                    </Box>
                </Box>
            }

        </HStack >
    )
}

export default MemberCard