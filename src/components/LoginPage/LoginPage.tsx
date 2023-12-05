import { TextField, ThemeProvider, createTheme } from '@mui/material'
import { Autocomplete } from '@mui/material'
import useAssociations, { Association } from '../../hooks/useAssociations'
import { useMemo, useState } from 'react'
import { Text } from '@chakra-ui/react'


const LoginPage = () => {

    const associations = useAssociations({ limit: 10, projection: 'full' }).data
    const [selectedAssociation, setSelectedAssociation] = useState<Association | null>()

    return (
        <>
            <ThemeProvider theme={createTheme()}>
                <Autocomplete options={associations}
                    getOptionLabel={option => option.name} value={selectedAssociation || null}
                    renderInput={params => <TextField {...params} label="Válasszon egyesületet!" />}
                    onChange={(event: any, value: Association | null) => setSelectedAssociation(value)} />
            </ThemeProvider>
            <Text>{selectedAssociation?.name}</Text>
            <Text>{selectedAssociation?.location}</Text>
            <Text>{selectedAssociation?._id}</Text>
            <Text>{selectedAssociation?.certificate}</Text>
        </>
    )
}

export default LoginPage