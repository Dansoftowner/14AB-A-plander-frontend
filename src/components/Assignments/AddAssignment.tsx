import { Box, Button, Divider, FormControl, FormLabel, HStack, Heading, Input, InputGroup, InputRightElement, List, ListItem, Spinner, Text, VStack } from "@chakra-ui/react"
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from "@choc-ui/chakra-autocomplete"
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { useInfiniteMembers } from "../../hooks/useMembers"
import { User } from "../../hooks/useLogin"
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './calendar.css'
import i18n from "../../i18n"

interface Props {
    inDuty: User[],
    setInDuty: Dispatch<SetStateAction<User[]>>
    value: string[],
    setValue: Dispatch<SetStateAction<string[]>>
    title: string,
    setTitle: Dispatch<SetStateAction<string>>
    location: string,
    setLocation: Dispatch<SetStateAction<string>>
}

const AddAssignment = ({ inDuty, setInDuty, value, setValue, location, title, setLocation, setTitle }: Props) => {

    const [qParam, setQParam] = useState('')
    const { data: members, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteMembers({ limit: 4, projection: 'lite', q: qParam })
    const [selectedMember, setSelectedMember] = useState({} as User)
    const [content, setContent] = useState('')

    return (
        <>
            <VStack>
                <FormControl my={5}>
                    <FormLabel>Szolgálat neve</FormLabel>
                    <InputGroup>
                        <Input placeholder='Nem kötelező.' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </InputGroup>
                </FormControl>

                <FormControl mb={10}>
                    <FormLabel>Szolgálat helyszíne</FormLabel>
                    <InputGroup>
                        <Input placeholder='Nem kötelező.' value={location} onChange={(e) => setLocation(e.target.value)} />
                    </InputGroup>
                </FormControl>
            </VStack>

            <HStack>

                <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => { setSelectedMember(val.originalValue); setContent(val.originalValue.name) }} isLoading={isLoading} emptyState={<Text textAlign='center'>Nincs ilyen nevű tag!</Text>}>
                    <InputGroup>
                        <AutoCompleteInput autoComplete="off" placeholder='Tag neve' value={content}
                            borderRadius={10}
                            fontSize={18}
                            h={10}
                            onChange={(val: any) => {
                                setQParam(val.target.value)
                                setContent(val.target.value)
                            }}
                        />
                        <InputRightElement
                            children={<FaChevronDown />} />
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
                    if (selectedMember._id && !inDuty.includes(selectedMember)) {
                        setInDuty([...inDuty, selectedMember])
                    }
                    setSelectedMember({} as User)
                    setQParam('')
                    setContent('')
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
                <DateTimeRangePicker locale={i18n.language == 'hu' ? 'hu-HU' : 'en-US'} value={[value[0], value[1]]} onChange={setValue} />
            </Box>
        </>
    )
}

export default AddAssignment