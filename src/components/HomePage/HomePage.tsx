import { useTrail, animated as a } from '@react-spring/web'
import { useEffect, useState } from 'react';
import '../../App.css'
import { useAuth } from '../../hooks/hooks';
import { Box, HStack, Heading, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { ReactTyped } from 'react-typed';
import apiClient from '../../services/apiClient';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Association } from '../../hooks/useAssociations';

import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";



const HomePage = () => {
    const { user } = useAuth()
    const { t } = useTranslation()
    const fontColor = useColorModeValue('#000000', '#ffffff')

    const name = user?.name;
    const [association, setAssociation] = useState<Association | undefined>(undefined)
    const [valid, setValid] = useState(true)

    useEffect(() => {
        if (localStorage.getItem('token') == null && sessionStorage.getItem('token') == null) setValid(false)
        apiClient.get('/associations/mine?projection=full', { headers: { 'x-plander-auth': localStorage.getItem('token') || sessionStorage.getItem('token') } })
            .then(res => setAssociation(res.data));
    }, [])

    const items = [t('welcome'), t('back,'), name?.split(" ")[0], name?.split(" ")[1], name?.split(" ")[2]];;
    const config = { mass: 5, tension: 2000, friction: 200 };
    const [toggle, set] = useState(true);
    const trail = useTrail(items.length, {
        config,
        opacity: toggle ? 1 : 0,
        x: toggle ? 0 : 20,
        height: toggle ? 100 : 0,
        from: { opacity: 0, x: 20, height: 0 }
    });


    if (!valid) return <Navigate to='/login' />

    return (
        <>
            <HStack >
                <Box mx={2} sx={{ '.trails-text': { color: fontColor } }} mt={10} maxH='85vh' maxW='90vw' className="trails-main" onClick={() => set(state => !state)}>
                    <Box>
                        {trail.map(({ x, height, ...rest }, index) => (
                            <a.div
                                key={index}
                                className={index > 1 ? "trails-text name" : "trails-text"}
                                style={{
                                    ...rest,
                                    transform: x.to(x => `translate3d(0,${x}px,0)`)
                                }}
                            >
                                <a.div style={{ height }}>{items[index]}</a.div>
                            </a.div>
                        ))}
                    </Box>
                </Box>
            </HStack>
            <Box borderRadius={20} boxShadow='dark-lg' padding={10} position='absolute' top='50%' left='75%' transform='translate(-50%, -50%)' textAlign='center' >
                <Heading
                    mb={0}
                    color={fontColor}
                    className='.trails-text'
                    fontSize='xx-large'
                    textTransform='uppercase'
                > <ReactTyped strings={[association ? association?.name : '']} typeSpeed={130}
                    backSpeed={130} showCursor={false} />
                </Heading>
                <HStack mt={5}>
                    <Icon as={IoLocationSharp} fontSize='2xl' />
                    <Text my={0} fontStyle='italic'>{association?.location}</Text>
                </HStack>
                <HStack mt={5}>
                    <Icon as={MdOutlineVerified} fontSize='2xl' />
                    <Text my={0} fontStyle='italic'>{association?.certificate}</Text>
                </HStack>
            </Box>

        </>
    )
}

export default HomePage