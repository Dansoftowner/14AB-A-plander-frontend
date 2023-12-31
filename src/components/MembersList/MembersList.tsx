import { Button, Spinner, useColorModeValue, HStack, Box, Text } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import MemberCard from "../MemberCard/MemberCard"
import { useMembers } from "../../hooks/useMembers"
import { useQueryClient } from "@tanstack/react-query"

import { FaPlus } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore, MdLastPage, MdFirstPage } from "react-icons/md";


import useAuth from "../../hooks/useAuth"
import { useTranslation } from "react-i18next"




const MembersList = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const [valid, setValid] = useState(true)
    useEffect(() => {
        queryClient.removeQueries(['members'])
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
    }, [])


    const [page, setPage] = useState(1)
    const limit = 4
    const { data, isLoading } = useMembers({ limit: limit, projection: 'full', offset: ((page - 1) * limit) })

    const queryClient = useQueryClient()
    const { t } = useTranslation('register')

    const { user } = useAuth()
    const navigate = useNavigate()

    if (!valid) return <Navigate to='/login' />


    return (
        <>
            {
                isLoading && <Box textAlign='center' my='30vh'><Spinner size='xl' justifySelf='center' alignSelf='center' /></Box>
            }
            {
                user?.roles.includes('president') &&
                <HStack justifyContent='center' direction='column' maxW='95vw' border='1px solid' borderRadius={4} padding={4} margin={2}>
                    <Button textAlign='center' onClick={() => navigate('/members/invite')}>
                        <HStack h={40} verticalAlign='middle' alignItems='center' justifyContent='center'>
                            <FaPlus />
                            <Text h={1} verticalAlign='middle'>{t('inviteMember')}</Text>
                        </HStack>
                    </Button>
                </HStack>
            }
            {
                data?.items.map((member, index) => {
                    return <MemberCard _id={member._id} key={index}
                        email={member.email} name={member.name} phone={member.phoneNumber} isRegistered={member.isRegistered} />
                })
            }
            {
                data && <HStack justifyContent='space-around' mx={10}>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === 1} onClick={() => setPage(1)}> <MdFirstPage/> </Button>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === 1} onClick={() => setPage(page - 1)}> <MdNavigateBefore /> </Button>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === Math.ceil(data!.metadata.total / data!.metadata.limit)} onClick={() => setPage(page + 1)}> <MdNavigateNext /> </Button>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} isDisabled={page === Math.ceil(data!.metadata.total / data!.metadata.limit)} onClick={() => setPage(Math.ceil(data!.metadata.total / data!.metadata.limit))}> <MdLastPage /> </Button>
                </HStack>
            }
        </>
    )
}

export default MembersList