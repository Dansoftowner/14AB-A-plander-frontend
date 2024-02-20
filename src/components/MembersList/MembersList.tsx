import { Button, Spinner, useColorModeValue, HStack, Box, Text, InputGroup, Input, InputRightElement, Image, Stack, VStack, Icon } from "@chakra-ui/react"
import { useState, useEffect, KeyboardEvent } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import MemberCard from "../MemberCard/MemberCard"
import { useMembers } from "../../hooks/useMembers"
import useAuth from "../../hooks/useAuth"
import { useTranslation } from "react-i18next"

import { FaPlus } from "react-icons/fa";
import { IoCloseCircleOutline, IoSearch } from "react-icons/io5";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md"


const MembersList = () => {

    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')
    const buttonHover = useColorModeValue('#0078b0', '#fde7af')

    const [limit, setLimit] = useState(window.innerWidth > 1850 ? 4 : window.innerWidth > 1550 ? 3 : window.innerWidth > 1100 ? 2 : 1)

    const [valid, setValid] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
        const resizeHandler = () => {
            setLimit(window.innerWidth > 1850 ? 4 : window.innerWidth > 1550 ? 3 : window.innerWidth > 1100 ? 2 : 1)
        }

        window.addEventListener("resize", resizeHandler)
    }, [limit])

    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [q, setQ] = useState("")
    const { data, isLoading } = useMembers(q ? { limit: limit, q: q, offset: ((page - 1) * limit) } : { limit: limit, offset: ((page - 1) * limit) })

    const { t } = useTranslation('register')

    const { user } = useAuth()
    const navigate = useNavigate()

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter')
            setQ(search)
    }

    const handlePage = (n: number) => {
        setPage(n)
    }

    if (!valid) return <Navigate to='/login' />

    return (
        <VStack>
            {
                isLoading && <Box textAlign='center' my='30vh'><Spinner size='xl' justifySelf='center' alignSelf='center' /></Box>
            }
            {
                data &&
                <HStack my={6} justifyContent='center' borderRadius={10} w={600} maxW='80vw' >
                    <InputGroup>
                        <Input onKeyDown={handleKeyPress} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchByName')} />
                        {search &&
                            <InputRightElement>
                                <Button backgroundColor='transparent' _hover={{ backgroundColor: 'transparent', color: 'red' }} onClick={() => { setQ(""); setSearch("") }}>
                                    <Stack height={30} width={30} justifyContent='center'>
                                        <Image as={IoCloseCircleOutline} />
                                    </Stack>
                                </Button>
                            </InputRightElement>
                        }
                    </InputGroup>
                    <Button _hover={{ backgroundColor: buttonHover }} backgroundColor={buttonBg} color={buttonColor} onClick={() => setQ(search)}>
                        <Stack height={30} justifyContent='center'>
                            <Image as={IoSearch} />
                        </Stack>
                    </Button>
                </HStack>

            }


            <HStack transition='1s all' mx='auto' alignItems='center' maxW='95vw' justifyContent='center'>
                {(data && page > 1) &&
                    <Button ml={3} _hover={{ fontSize: 45, transition: '0.2s ease' }} px={0} _focus={{ backgroundColor: 'transparent' }} backgroundColor='transparent' onClick={() => handlePage(page - 1)}>
                        <Icon as={MdNavigateBefore} fontSize={30} />
                    </Button>
                }
                {
                    data?.items?.map((member: any, index: any) =>
                    (
                        <MemberCard _id={member._id} key={index}
                            email={member.email} name={member.name} phone={member.phoneNumber} isRegistered={member.isRegistered} />

                    ))
                }
                {
                    (data && !(page === Math.ceil(data!.metadata!.total / data!.metadata.limit))) &&
                    <Button px={0} _hover={{ fontSize: 45, transition: '0.2s ease' }} _focus={{ backgroundColor: 'transparent' }} backgroundColor='transparent' onClick={() => handlePage(1 + page)}>
                        <Icon as={MdNavigateNext} fontSize={30} />
                    </Button>
                }
            </HStack >

            {
                user?.roles.includes('president') &&
                <Button mt={10} boxShadow='md' textAlign='center' backgroundColor={buttonBg} color={buttonColor} _hover={{ backgroundColor: buttonHover }} onClick={() => navigate('/members/invite')}>
                    <HStack p={4} verticalAlign='middle' alignItems='center' justifyContent='center'>
                        <FaPlus />
                        <Text h={1} verticalAlign='middle'>{t('inviteMember')}</Text>
                    </HStack>
                </Button>
            }
        </VStack >
    )
}

export default MembersList