import { Box, Button, Divider, FormControl, FormLabel, HStack, Heading, Input, InputGroup, List, ListItem, Spinner, Text, VStack } from "@chakra-ui/react"
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from "@choc-ui/chakra-autocomplete"
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { User, useAuth, useInfiniteMembers } from "../../hooks/hooks"
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './calendar.css'
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next"

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
    inDuty: User[],
    setInDuty: Dispatch<SetStateAction<User[]>>
    value: Value[],
    setValue: Dispatch<SetStateAction<Value[]>>
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

    const { t } = useTranslation('assignments')
    const { user } = useAuth()

    return (
        <>
            <VStack>
                <FormControl my={5}>
                    <FormLabel>{t('assignmentName')}</FormLabel>
                    <InputGroup>
                        <Input placeholder={t('optional')} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </InputGroup>
                </FormControl>

                <FormControl mb={10}>
                    <FormLabel>{t('assignmentLocation')}</FormLabel>
                    <InputGroup>
                        <Input placeholder={t('optional')} value={location} onChange={(e) => setLocation(e.target.value)} />
                    </InputGroup>
                </FormControl>
            </VStack>

            {user.roles?.includes('president') &&
                <HStack>
                    <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => {
                        setContent('')
                        setSelectedMember(val.originalValue);
                        setContent(val.originalValue.name)
                    }} value={content} isLoading={isLoading} emptyState={<Text textAlign='center'>{t('noMemberFound')}</Text>}>
                        <InputGroup>
                            <AutoCompleteInput autoComplete="off" placeholder={t('memberName')} value={content}
                                borderRadius={10}
                                fontSize={18}
                                h={10}
                                onChange={(val: any) => {
                                    setQParam(val.target.value)
                                    setContent(val.target.value)
                                }}
                            />
                        </InputGroup>

                        <AutoCompleteList loadingState={<Spinner />}>
                            {members?.pages.map((page, index) =>
                                <Fragment key={index} >
                                    {page.items.filter(r => r.name).map(member => (
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
                            if (!inDuty.map(x => x.name).includes(content)) {
                                setInDuty([...inDuty, selectedMember])
                            }
                        }
                        setSelectedMember({} as User)
                        setQParam('')
                        setContent('')
                    }}><Text mb={0}>{t('add')}</Text></Button>
                </HStack >
            }

            <Heading mt={5} fontSize='medium'>{t('membersInDuty')}</Heading>
            <List mb={5} borderRadius={5}>
                {inDuty.map((member, index) => (
                    <ListItem key={index} mx={0}>
                        <HStack>
                            <Text mb={0}>{member.name}</Text>
                            {
                                user.roles?.includes('president') &&
                                <Button backgroundColor='transparent' _hover={{ backgroundColor: 'transparent', fontSize: 20, transition: '.1s ease-out' }} ml='auto' onClick={() => {
                                    setInDuty(inDuty.filter(x => x._id !== member._id))
                                }}>
                                    <Text mb={0} color='red'><FaTrash /></Text>
                                </Button>
                            }
                        </HStack>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <Heading mt={5} fontSize='medium'>{t('dateOfAssignment')}</Heading>
            <Box>
                <DateTimeRangePicker locale='hu-HU' value={value as Value} onChange={(value) => setValue(value as Value[])} />
            </Box>
        </>
    )
}

export default AddAssignment