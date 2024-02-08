import { Button, Divider, FormControl, FormLabel, HStack, Text, Input, InputGroup, Radio, RadioGroup, VStack, Menu, MenuItem, Select, Textarea } from "@chakra-ui/react"
import { User, useAuth, useReport, useReportPDF } from "../../hooks/hooks"
import { t, use } from "i18next"
import { useEffect, useState } from "react"

interface Props {
    id: string
    assignees: User[]
}


const ReportDetail = ({ id, assignees }: Props) => {

    const [method, setMethod] = useState('0')
    const [independent, setIndependent] = useState('0')

    const { user } = useAuth()

    const canEdit = assignees.map(r => r._id).includes(user._id)

    return (
        <>
            <VStack >
                <FormControl my={5} isRequired isReadOnly={!canEdit}>
                    <FormLabel>Szolgálat módja:</FormLabel>
                    <RadioGroup onChange={setMethod} value={method}>
                        <Radio mx={2} value="vehicle">Gépkocsi</Radio>
                        <Radio mx={2} value="bicycle">Kerékpáros</Radio>
                        <Radio mx={2} value="pedestrian">Gyalogos</Radio>
                    </RadioGroup>
                </FormControl>

                {method == 'vehicle' &&
                    <FormControl isReadOnly={!canEdit}>
                        <HStack my={2}>
                            <FormLabel width={200} fontSize={15}>Gépkocsi rendszáma:</FormLabel>
                            <Input width={140}></Input>
                        </HStack>
                        <HStack >
                            <FormLabel width={118} fontSize={15}>Km óra állása:</FormLabel>
                            <Input width={100}></Input>
                            <Text my={0}>-</Text>
                            <Input width={100}></Input>
                        </HStack>
                    </FormControl>
                }
                <Divider my={2} />

                <HStack width={400}>
                    <FormControl isRequired isReadOnly={!canEdit}>
                        <FormLabel>Szolgálat típusa:</FormLabel>
                        <RadioGroup onChange={setIndependent} value={independent}>
                            <Radio mx={2} value="1">Önálló</Radio>
                            <Radio mx={2} value="2">Közös</Radio>
                        </RadioGroup>
                    </FormControl>
                </HStack>
                {independent == "2" &&
                    <FormControl isReadOnly={!canEdit}>
                        <VStack width={400}>
                            <FormLabel width={370} fontSize={15}>Külső szervezet:</FormLabel>
                            <Input width={350} mr={10}></Input>
                        </VStack>
                        <VStack width={400}>
                            <FormLabel width={370} fontSize={15}>Külső szervezet képviselője:</FormLabel>
                            <Input width={350} mr={10}></Input>
                        </VStack>
                    </FormControl>
                }
                <Divider my={2} />

                <FormControl width={400} my={2} isReadOnly={!canEdit}>
                    <FormLabel w={400}>Szolgálat fajtája:</FormLabel>
                    <Select isReadOnly={!canEdit} disabled={!canEdit}>
                        <option>Jelző-figyelő járőrözés</option>
                        <option>Rendezvénybiztosítás</option>
                        <option>Iskolaszolgálat</option>
                        <option>Gépjárműfelderítés</option>
                        <option>Postáskísérés</option>
                    </Select>
                </FormControl>

                <Textarea isReadOnly={!canEdit} placeholder="Ha történt rendkívüli esemény, annak rövid leírása" width={400} height={100} maxLength={1240} />
            </VStack >
            {/* <Button onClick={() => useReportPDF(id)}>PDF export</Button> */}
        </>
    )
}

export default ReportDetail