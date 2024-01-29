import { Button, HStack, Heading, InputGroup, InputLeftElement, InputRightElement, List, ListItem, Spinner, Text, UnorderedList, border } from "@chakra-ui/react"
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from "@choc-ui/chakra-autocomplete"
import { t } from "i18next"
import { Fragment, useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { MdOutlineLocalPolice } from "react-icons/md"
import { useInfiniteMembers } from "../../hooks/useMembers"
import { User } from "../../hooks/useLogin"

const AddAssignment = () => {

    const [qParam, setQParam] = useState('')
    const { data: members, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteMembers({ limit: 4, projection: 'lite', q: qParam })
    const [selectedMember, setSelectedMember] = useState({} as User)

    const [inDuty, setInDuty] = useState([] as User[])

    return (
        <>
            <HStack>
                <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => setSelectedMember(val.originalValue)} isLoading={isLoading} emptyState={<Text textAlign='center'>Nincs ilyen egyesület!</Text>}>
                    <InputGroup>
                        <AutoCompleteInput autoComplete="off" placeholder='Tag neve' value={selectedMember.name || ''}
                            borderRadius={10}
                            fontSize={20}
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
                    setInDuty([...inDuty, selectedMember])
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

              
        </>
    )
}

export default AddAssignment