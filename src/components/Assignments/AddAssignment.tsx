import { Button, InputGroup, InputLeftElement, InputRightElement, Spinner, Text } from "@chakra-ui/react"
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from "@choc-ui/chakra-autocomplete"
import { t } from "i18next"
import { Fragment, useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { MdOutlineLocalPolice } from "react-icons/md"
import { useInfiniteMembers } from "../../hooks/useMembers"

const AddAssignment = () => {

    const [qParam, setQParam] = useState('')
    const { data: members, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteMembers({ limit: 4, projection: 'lite', q: qParam })
    const [selectedMember, setSelectedMember] = useState('')

    let membersInDuty = []

    return (
        <>
            <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => setSelectedMember(val.originalValue)} isLoading={isLoading} emptyState={<Text textAlign='center'>Nincs ilyen egyesület!</Text>}>
                <InputGroup>
                    <AutoCompleteInput autoComplete="off" placeholder={t('associationSelector')}
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
        </>
    )
}

export default AddAssignment