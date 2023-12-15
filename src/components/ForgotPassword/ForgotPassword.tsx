import { Box, Button, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from '@choc-ui/chakra-autocomplete'
import { Fragment, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineLocalPolice } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { Association, useAssociations } from '../../hooks/useAssociations'
import { useTranslation } from 'react-i18next'

const ForgotPassword = () => {

    const dropDownFont = useColorModeValue('#808080', '#ffffff')
    const buttonBg = useColorModeValue('#0078d7', '#fde74c')
    const buttonColor = useColorModeValue('#ffffff', '#004881')

    const { t } = useTranslation()

    const { id, restorationToken } = useParams()
    if (id && restorationToken) {
        return (
            <>
                fasza
            </>
        )
    }


    const [selectedAssociation, setSelectedAssociation] = useState<Association | null>()
    const [email, setEmail] = useState<string>('')

    const [qParam, setQParam] = useState('')
    const { data: associations, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage, } = useAssociations({ limit: 4, projection: 'lite', q: qParam })


    return (
        <Stack border={1} alignItems='center' justifyContent='center' display='flex' h='90vh'>
            <Heading as='h1'>Elfelejtette jelszavát? Semmi baj!</Heading>
            <Text maxW={650} textAlign='center' fontSize='larger'>Válassza ki egyesületét és adja meg azt e-mail címet amivel be lett Ön regisztrálva.
                Ezt követően rendszerünk egy automata levelet küld egy link-kel, melyet megnyitva beállíthatja új jelszavát.</Text>
            <Box width={400} margin={5}>
                <FormLabel>Egyesület</FormLabel>
                <AutoComplete freeSolo openOnFocus onChange={(_e: any, val: any) => setSelectedAssociation(val.originalValue)} isLoading={isLoading} emptyState={<Text textAlign='center' color={dropDownFont}>Nincs ilyen egyesület!</Text>}>
                    <InputGroup>
                        <AutoCompleteInput borderColor='#767676' autoComplete="off" placeholder={t('associationSelector')}
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
                        {associations?.pages.map((page, index) =>
                            <Fragment key={index} >
                                {page.items.map(association => (
                                    <AutoCompleteItem
                                        key={association._id}
                                        value={association}
                                        label={association.name}
                                        textTransform="capitalize"
                                        color={dropDownFont}
                                    >
                                        {association.name || 'nem jo gec'}
                                    </AutoCompleteItem>
                                ))}
                            </Fragment>)}
                        {hasNextPage &&
                            <Button color={dropDownFont} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? <Spinner /> : '...'}
                            </Button>}
                    </AutoCompleteList>
                </AutoComplete>
            </Box>


            <Box margin={5} w={400} >
                <FormLabel>E-mail cím</FormLabel>
                <Input type='email' borderColor='#767676' placeholder='Email cím' borderRadius={10} fontSize={20} h={10} />
            </Box>

            <Button margin={5} padding={5} backgroundColor={buttonBg} color={buttonColor}>Új jelszó kérése</Button>
            <Button margin={5} padding={5} backgroundColor={buttonBg} color={buttonColor}>
                <Link to='/login'>Vissza a bejelentkezéshez</Link>
            </Button>
        </Stack>
    )
}

export default ForgotPassword