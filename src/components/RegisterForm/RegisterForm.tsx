import { Button, HStack, Heading, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"

export const RegisterForm = () => {

    const [show, setShow] = useState(false)
    const setPasswordVisibility = () => setShow(!show)

    {/*Validation-t csinálom majd*/}


    return (
        <form className="mx-auto container mt-3">
            <Heading marginBottom={10}>Plander regisztráció</Heading>
            <Heading size='lg'>Belépési adatok</Heading>
            <hr />
            <Stack marginBottom={5}>
                <div className="mb-3">
                    <Text>Felhasználónév</Text>
                    <Input width={400} placeholder="Adjon meg egy felhasználónevet"/>
                </div>
                <Text>Jelszó</Text>
                <HStack justify='start'>
                    <div className="mb-3">
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Válasszon jelszót' width={400}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' margin={1} onClick={setPasswordVisibility}>
                                    {show ? 'Elrejtés' : 'Mutasd'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </div>
                    <div className="mb-3">
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={"password"}
                                placeholder='Jelszó mégegyszer' width={400}
                            />
                        </InputGroup>
                    </div>
                </HStack>
            </Stack>
            <Heading size='lg'>Személyes adatok</Heading>
            <hr />
            {/* */}


        </form>
    )
}