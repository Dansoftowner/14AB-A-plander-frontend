import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Button,
    Text,
    HStack,
    Center,
} from '@chakra-ui/react'
import { BsChevronDown } from 'react-icons/bs'
import { PhoneFormat as Phone } from './phones'

interface Props {
    items: Phone[]
    selectedPhone: Phone
    selectionChange: (phone: Phone) => void
    isDisabled?: boolean
}

const PhoneDropdownList = ({
    items,
    selectionChange,
    selectedPhone,
    isDisabled
}: Props) => {
    return (

        <Menu matchWidth>
            <MenuButton isDisabled={isDisabled} width={150} as={Button} rightIcon={<BsChevronDown />}>
                <HStack >
                    <Image boxSize="2rem" src={selectedPhone.src || '/assets/flags/hu.svg'} mr="12px" />
                    <Text mt={3}>{selectedPhone.prefix || '+36'}</Text>
                </HStack>
            </MenuButton>
            <MenuList>
                {items.map((p) => (
                    <MenuItem key={p.prefix} minH="48px" onClick={() => selectionChange(p)}>
                        <HStack>
                            <Center >
                                <Image boxSize="2rem" src={p.src} mr="12px" />
                                <Text mt={3}> {p.prefix} </Text>
                            </Center>
                        </HStack>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    )
}

export default PhoneDropdownList
