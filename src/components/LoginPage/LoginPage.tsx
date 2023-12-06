import {
  Container,
  Input,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Autocomplete } from '@mui/material'
import useAssociations, { Association } from '../../hooks/useAssociations'
import { useMemo, useState } from 'react'
import { Box, InputGroup, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { schema } from '../RegisterForm/inputSchema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PasswordInput from '../RegisterForm/PasswordInput'

const LoginPage = () => {
  const cardBackground = useColorModeValue('#89D0DF', '#3393DF')
  const textColor = useColorModeValue('#0078D7', '#004881')
  
  const { t } = useTranslation()
    const inputSchema = useMemo(() => schema(t), [t])

    type RegForm = z.infer<typeof inputSchema>

    const { register, handleSubmit, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(inputSchema) })

  const associations = useAssociations({ limit: 10, projection: 'full' }).data
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>()

  return (
    <>
      <Box
        className="mx-auto container mt-3"
        borderRadius="xl"
        bg={cardBackground}
        color="white"
        h={600}
        w={500}
      >
        <Text
          color={textColor}
          fontSize="x-large"
          fontFamily="Moul"
          fontWeight="md"
        >
          Plander
        </Text>

        <PasswordInput register={register} name="password" errors={errors} required i18nPlaceHolder="regForm-pwdPholder" i18nTitle="password" />


        <ThemeProvider theme={createTheme()}>
          <Autocomplete
            options={associations}
            getOptionLabel={(option) => option.name}
            value={selectedAssociation || null}
            renderInput={(params) => (
              <TextField {...params} label="Válasszon egyesületet!" />
            )}
            onChange={(_event: any, value: Association | null) =>
              setSelectedAssociation(value)
            }
          />
        </ThemeProvider>

        <Text>{selectedAssociation?.name}</Text>
        <Text>{selectedAssociation?.location}</Text>
        <Text>{selectedAssociation?._id}</Text>
        <Text>{selectedAssociation?.certificate}</Text>
      </Box>
    </>
  )
}

export default LoginPage
