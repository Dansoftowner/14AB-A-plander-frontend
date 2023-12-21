import { Box, HStack, Stack, VStack, Text, Button } from '@chakra-ui/react'
import { FaUserAlt, FaTrash } from "react-icons/fa";

interface Props {
    name: string;
    email: string;
    phone: string;
}

const MemberCard = ({ email, name, phone }: Props) => {
    return (
        <HStack direction='column' border='1px solid' borderRadius={4} padding={4} margin={2}>
            <Stack width={55}>
                <Text fontSize={40}><FaUserAlt /></Text>
            </Stack>
            <VStack textAlign='start'>
                <Text width={400} margin={1}><b>Név:</b> {name}</Text>
                <Text width={400} margin={1}><b>Email cím:</b> {email}</Text>
                <Text width={400} margin={1}><b>Telefonszám:</b> {phone}</Text>
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