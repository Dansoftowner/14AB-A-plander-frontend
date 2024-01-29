import { Box, Button, Divider, FormControl, FormLabel, HStack, Heading, Input, InputGroup, InputLeftElement, InputRightElement, List, ListItem, Spinner, Text, UnorderedList, VStack, border, useColorModeValue } from "@chakra-ui/react"
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from "@choc-ui/chakra-autocomplete"
import { t } from "i18next"
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { MdOutlineLocalPolice } from "react-icons/md"
import { useInfiniteMembers } from "../../hooks/useMembers"
import { User } from "../../hooks/useLogin"
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './calendar.css'
import i18n from "../../i18n"


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
    inDuty: User[],
    setInDuty: Dispatch<SetStateAction<User[]>>
    value: Value,
    setValue: Dispatch<SetStateAction<Value>>
    
}

const AddAssignment = ({ inDuty, setInDuty, value, setValue }: Props) => {

    const [qParam, setQParam] = useState('')
    const { data: members, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteMembers({ limit: 4, projection: 'lite', q: qParam })
    const [selectedMember, setSelectedMember] = useState({} as User)


    return (
        <>
            <VStack>
                <FormControl my={5}>
                    <FormLabel>Szolgálat neve</FormLabel>
                    <InputGroup>
                        <Input placeholder='Nem kötelező.' />
                    </InputGroup>
                </FormControl>

                <FormControl mb={10}>
                    <FormLabel>Szolgálat helyszíne</FormLabel>
                    <InputGroup>
                        <Input placeholder='Nem kötelező.' />
                    </InputGroup>
                </FormControl>
            </VStack>
            <HStack>

                <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => setSelectedMember(val.originalValue)} isLoading={isLoading} emptyState={<Text textAlign='center'>Nincs ilyen egyesület!</Text>}>
                    <InputGroup>
                        <AutoCompleteInput autoComplete="off" placeholder='Tag neve' value={selectedMember.name || ''}
                            borderRadius={10}
                            fontSize={18}
                            h={10}
                            onChange={(val: any) => {
                                setQParam(val.target.value)
                            }}
                        />
                        <InputRightElement
                            children={<FaChevronDown />} />
                        <InputLeftElement>
                            <MdOutlineLocalPolice />
                        </InputLeftElement>
                    </InputGroup>
                    <AutoCompleteList loadingState={<Spinner />}>
                        {members?.pages.map((page, index) =>
                            <Fragment key={index} >
                                {page.items.map(member => (
                                    <AutoCompleteItem
                                        key={member._id}
                                        value={member}
                                        label={member.name}
                                        textTransform="capitalize"
                                    >
                                        {member.name || 'nem jo gec'}
                                    </AutoCompleteItem>
                                ))}
                            </Fragment>)}
                        {hasNextPage &&
                            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? <Spinner /> : '...'}
                            </Button>}
                    </AutoCompleteList>
                </AutoComplete>
                <Button onClick={() => {
                    if (selectedMember._id) {
                        setInDuty([...inDuty, selectedMember])
                    }
                    console.log(value)
                    console.log(inDuty)
                    setSelectedMember({} as User)
                }}><Text mb={0}>Felvétel</Text></Button>
            </HStack >

            <Heading mt={5} fontSize='medium'>Beosztott tagok</Heading>
            <List mb={5} borderRadius={5}>
                {inDuty.map((member, index) => (
                    <ListItem key={index} mx={0}>
                        <Text>{member.name}</Text>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <Heading mt={5} fontSize='medium'>Szolgálat ideje</Heading>
            <Box>
                <DateTimeRangePicker locale={i18n.language == 'hu' ? 'hu-HU' : 'en-US'} value={value} onChange={setValue} />
            </Box>
        </>
    )
}

export default AddAssignment