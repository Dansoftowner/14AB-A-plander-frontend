import { Box, HStack, Stack, VStack, Text, Button, Show } from '@chakra-ui/react'
import { FaUserAlt, FaTrash } from "react-icons/fa";

interface Props {
    name: string;
    email: string;
    phone: string;
}

const MemberCard = ({ email, name, phone }: Props) => {
    return (
        <HStack direction='column' maxW='95vw' border='1px solid' borderRadius={4} padding={4} margin={2}>
            <Show above='lg'>
                <Stack width={55}>
                    <Text fontSize={40}><FaUserAlt /></Text>
                </Stack>
            </Show>
            <VStack textAlign='start'>
                <Text width={400} maxW='70vw' margin={1}><b>Név:</b> {name}</Text>
                <Text width={400} maxW='70vw' margin={1}><b>Email cím:</b> {email}</Text>
                <Text width={400} maxW='70vw' margin={1}><b>Telefonszám:</b> {phone}</Text>
            </VStack>
            <Box ml='auto'>
                <Button >
                    <Text margin={0} color='red'><FaTrash /></Text>
                </Button>
            </Box>
        </HStack >
    )
}

export default MemberCard