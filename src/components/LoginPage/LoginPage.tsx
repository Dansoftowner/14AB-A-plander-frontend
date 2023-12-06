import {
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Autocomplete } from '@mui/material'
import useAssociations, { Association } from '../../hooks/useAssociations'
import { useMemo, useState } from 'react'
import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { loginSchema } from '../RegisterForm/inputSchema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PasswordInput from '../RegisterForm/PasswordInput'
import FormInput from '../RegisterForm/FormInput'

const LoginPage = () => {
  const cardBackground = useColorModeValue('#89D0DF', '#3393DF')
  const textColor = useColorModeValue('#0078D7', '#004881')

  const { t } = useTranslation()
  const inputSchema = useMemo(() => loginSchema(t), [t])

  type LoginForm = z.infer<typeof inputSchema>

  const { register, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(inputSchema) })

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
        alignItems='center'
      >
        <Text
          color={textColor}
          fontSize="x-large"
          fontFamily="Moul"
          fontWeight="md"
        > Plander</Text>





        <Stack mt={10} alignItems='center'>
          <ThemeProvider theme={createTheme()}>
            <Autocomplete
              options={associations}
              fullWidth
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

          <FormInput login register={register} name="username" errors={errors} required={false} i18nPlaceHolder="Felhasználónév" />
          <PasswordInput login register={register} name="password" errors={errors} required={false} i18nPlaceHolder="regForm-pwdPholder" i18nTitle="" />
        </Stack>

        <Text>{selectedAssociation?.name}</Text>
        <Text>{selectedAssociation?.location}</Text>
        <Text>{selectedAssociation?._id}</Text>
        <Text>{selectedAssociation?.certificate}</Text>
      </Box>
    </>
  )
}

export default LoginPage
