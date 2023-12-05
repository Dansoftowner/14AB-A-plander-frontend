import { TextField } from '@mui/material'
import { Autocomplete, Button } from '@mui/material'
import useAssociations from '../../hooks/useAssociations'

interface AutocompleteOption {
    name: string
}

const LoginPage = () => {

    const associations = useAssociations().data
    console.log(useAssociations().data);


    return (
        <>
            <Autocomplete options={associations} getOptionLabel={option => option.name} renderInput={params => <TextField {...params} label="yes" />} />
        </>
    )
}

export default LoginPage