import { TextField, ThemeProvider, createTheme } from '@mui/material'
import { Autocomplete } from '@mui/material'
import useAssociations from '../../hooks/useAssociations'


const LoginPage = () => {

    const associations = useAssociations({ limit: 10 }).data

    return (
        <>
            <ThemeProvider theme={createTheme()}>
                <Autocomplete options={associations} getOptionLabel={option => option.name} renderInput={params => <TextField {...params} label="Válasszon egyesületet!" />} />
            </ThemeProvider>
        </>
    )
}

export default LoginPage