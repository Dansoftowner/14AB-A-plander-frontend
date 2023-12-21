import { Button, Spinner, VStack, Text, useColorModeValue, Stack, HStack } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import MemberCard from "../MemberCard/MemberCard"
import { useMembers } from "../../hooks/useMembers"
import { AsQuery } from "../../hooks/useAssociations"
import { useQueryClient } from "@tanstack/react-query"

const MembersList = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const queryClient = useQueryClient()


    const [valid, setValid] = useState(true)
    useEffect(() => {
        queryClient.removeQueries(['members'])
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])

    if (!valid) return <Navigate to='/login' />

    const [page, setPage] = useState(1)
    const limit = 4
    const { data, isFetching, isLoading } = useMembers({ limit: limit, projection: 'full', offset: ((page - 1) * limit) })



    return (
        <>
            {
                isLoading && <Text textAlign='center' my='30vh'><Spinner size='xl' justifySelf='center' alignSelf='center' /></Text>
            }
            {
                data?.items.map((member, index) => {
                    return <MemberCard key={index} email={member.email} name={member.name} phone={member.phoneNumber} />
                })
            }
            {
                data && <HStack justifyContent='space-around' mx={10}>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === 1} onClick={() => setPage(1)}>First</Button>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === Math.ceil(data!.metadata.total / data!.metadata.limit)} onClick={() => setPage(page + 1)}>Next</Button>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === Math.ceil(data!.metadata.total / data!.metadata.limit)} onClick={() => setPage(Math.ceil(data!.metadata.total / data!.metadata.limit))}>Last</Button>
                </HStack>
            }
        </>
    )
}

export default MembersList