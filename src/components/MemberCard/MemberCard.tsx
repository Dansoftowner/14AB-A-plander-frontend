import { Box, HStack, Stack, VStack, Text, Button, Show } from '@chakra-ui/react'
import { FaUserAlt, FaTrash } from "react-icons/fa";
import { MdOutlineWarning } from "react-icons/md";
import useAuth from '../../hooks/useAuth';

interface Props {
    name: string;
    email: string;
    phone: string;
    removeHandler: () => void;
    isRegistered: boolean;
}

const MemberCard = ({ email, name, phone, removeHandler, isRegistered }: Props) => {
    const { user } = useAuth()

    return (
        <HStack direction='column' maxW='95vw' border='1px solid' borderRadius={4} padding={4} margin={2}>
            <Show above='lg'>
                <Stack width={55}>
                    <Text fontSize={40}><FaUserAlt /></Text>
                </Stack>
            </Show>
            <VStack textAlign='start'>
                <HStack>
                    <Text width={isRegistered ? 400 : 370} maxW={isRegistered ? '70vw' : '64vw'} margin={1}><b>Név:</b> {name}</Text>
                    {isRegistered == false && <Box color='yellow' title='A felhasználó nem fejezte be még a regisztrációt.'><MdOutlineWarning /></Box>}
                </HStack>
                <Text width={400} maxW='70vw' margin={1}><b>Email cím:</b> {email}</Text>
                <Text width={400} maxW='70vw' margin={1}><b>Telefonszám:</b> {phone}</Text>
            </VStack>
            {user?.roles.includes('president') &&
                <Box ml='auto'>
                    <Box>
                        <Button onClick={removeHandler}>
                            <Text margin={0} color='red'><FaTrash /></Text>
                        </Button>
                    </Box>
                </Box>
            }

        </HStack >
    )
}

export default MemberCard