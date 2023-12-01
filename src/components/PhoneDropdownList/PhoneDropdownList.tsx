import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Button,
    Text,
    HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { BsChevronDown } from 'react-icons/bs'
import { PhoneFormat as Phone } from './phones'

// import React from 'react'
// import { useTranslation } from 'react-i18next'

interface Props {
    items: Phone[]
    selectedPhone: Phone
    selectionChange: (phone: Phone) => void
}

const PhoneDropdownList = ({
    items,
    selectionChange,
    selectedPhone,
}: Props) => {
    console.log(selectedPhone)
    return (
        <>
            <Menu>
                <MenuButton as={Button} rightIcon={<BsChevronDown />}>
                    <HStack>
                            <Image boxSize="2rem" src={selectedPhone.src || '/assets/flags/hu.svg'} mr="12px" />
                            <Text alignContent='center' align='center' justifyContent='center'>{selectedPhone.prefix || '+36'}</Text>
                    </HStack>
                </MenuButton>
                <MenuList>
                    {items.map((p) => (
                        <MenuItem minH="48px" onClick={() => selectionChange(p)}>
                            <HStack>
                                <Image boxSize="2rem" src={p.src} mr="12px" />
                                <Text alignContent='center' align='center' textAlign='center' justifyContent='center'> {p.prefix} </Text>
                            </HStack>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </>
    )
}

export default PhoneDropdownList
