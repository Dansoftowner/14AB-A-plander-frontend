import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Button,
    Text,
  } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BsChevronDown } from 'react-icons/bs'

// import React from 'react'
// import { useTranslation } from 'react-i18next'

interface PhoneFormat {
    prefix: string;
    src: string
}

const phoneMap: PhoneFormat[] = [
    {
       prefix: '+36',
       src: "/assets/flags/hu.svg"
    },
    {
        prefix: '+1',
        src: "/assets/flags/us.svg"
    },
    {
        prefix: '+44',
        src: "/assets/flags/sk.svg"
    },
    {
        prefix: '+40',
        src: "/assets/flags/ro.svg"
    },
    {
        prefix: '+381',
        src: "/assets/flags/rs.svg"
    },
    {
        prefix: '+385',
        src: "/assets/flags/hr.svg"
    },
    {
        prefix: '+43',
        src: "/assets/flags/at.svg"
    },
    {
        prefix: '+386',
        src: "/assets/flags/si.svg"
    },
    {
        prefix: '+380',
        src: "/assets/flags/ua.svg"
    },
]

const PhoneDropdownList = () => {
    const { i18n, t } = useTranslation()
    return (
        <>
            <Menu>
                <MenuButton as={Button} rightIcon={ <BsChevronDown/>}>
                    {t('regForm-phonePrefix')}
                </MenuButton>
                <MenuList>
                    {phoneMap.map(p => 
                    <MenuItem minH="48px">
                        <Image
                            boxSize="2rem"
                            src={p.src}
                            mr="12px"
                        />
                        <Text>{p.prefix}</Text>
                    </MenuItem>)}
                </MenuList>
            </Menu>
        </>
    )
}

export default PhoneDropdownList
