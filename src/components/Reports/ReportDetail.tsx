import { Divider, FormControl, FormLabel, HStack, Text, Input, Radio, RadioGroup, VStack, Textarea, Select } from "@chakra-ui/react"
import { User, useAuth } from "../../hooks/hooks"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Report, useReport } from "../../hooks/useReports"
import { subDays } from "date-fns"

interface Props {
    id: string
    assignees: User[]
    report: Report,
    setReport: Dispatch<SetStateAction<Report>>
}


const ReportDetail = ({ assignees, report, setReport, id }: Props) => {



    const [independent, setIndependent] = useState('0')

    const options = [
        { value: '', label: '' },
        { value: 'Jelző-figyelő járőrözés', label: 'Jelző-figyelő járőrözés' },
        { value: 'Rendezvénybiztosítás', label: 'Rendezvénybiztosítás' },
        { value: 'Iskolaszolgálat', label: 'Iskolaszolgálat' },
        { value: 'Gépjárműfelderítés', label: 'Gépjárműfelderítés' },
        { value: 'Postáskísérés', label: 'Postáskísérés' },
    ]

    const handleChange = () => {
        const x = (document.getElementById('type') as any).value
        setReport({ ...report, purpose: x })
        setValue(x)
    }
    const [value, setValue] = useState(options[0].value)
    const { user } = useAuth()


    const canEdit = (type: 'patch' | 'add') => {
        return (new Date(report.submittedAt) > subDays(new Date(), 3))
            && (user.roles.includes('president') ||
                (type == 'add' ? assignees.map(r => r._id).includes(user._id)
                : user._id == report.author))
    }

    let edit = canEdit('add')

    const { data, isFetching } = useReport(id)
    useEffect(() => {
        setReport({} as Report)
        if (data && !isFetching) {
            edit = canEdit('patch')
            setReport(data)
            if (data?.externalOrganization || data?.externalRepresentative) {
                setIndependent('2')
            } else setIndependent('1')
            setValue(data.purpose)
        };
    }, [isFetching, id])



    return (
        <>
            <VStack >
                <FormControl my={5} isRequired isReadOnly={!edit}>
                    <FormLabel>Szolgálat módja:</FormLabel>
                    <RadioGroup onChange={(e) => setReport({ ...report, method: e })} value={report.method}>
                        <Radio mx={2} value="vehicle">Gépkocsi</Radio>
                        <Radio mx={2} value="bicycle">Kerékpáros</Radio>
                        <Radio mx={2} value="pedestrian">Gyalogos</Radio>
                    </RadioGroup>
                </FormControl>

                {report.method == 'vehicle' &&
                    <FormControl isReadOnly={!edit}>
                        <HStack my={2}>
                            <FormLabel width={200} fontSize={15}>Gépkocsi rendszáma:</FormLabel>
                            <Input width={140} value={report.licensePlateNumber} onChange={(e) => setReport({ ...report, licensePlateNumber: e.target.value })}></Input>
                        </HStack>
                        <HStack >
                            <FormLabel width={118} fontSize={15}>Km óra állása:</FormLabel>
                            <Input type="number" width={100} value={report.startKm} onChange={(e) => setReport({ ...report, startKm: parseInt(e.target.value) || undefined })}></Input>
                            <Text my={0}>-</Text>
                            <Input type="number" width={100} value={report.endKm} onChange={(e) => setReport({ ...report, endKm: parseInt(e.target.value) || undefined })}></Input>
                        </HStack>
                    </FormControl>
                }
                <Divider my={2} />

                <HStack width={400}>
                    <FormControl isRequired isReadOnly={!edit}>
                        <FormLabel>Szolgálat típusa:</FormLabel>
                        <RadioGroup onChange={setIndependent} value={independent}>
                            <Radio mx={2} value="1">Önálló</Radio>
                            <Radio mx={2} value="2">Közös</Radio>
                        </RadioGroup>
                    </FormControl>
                </HStack>
                {independent == "2" &&
                    <FormControl isReadOnly={!edit}>
                        <VStack width={400}>
                            <FormLabel width={370} fontSize={15}>Külső szervezet:</FormLabel>
                            <Input width={350} mr={10} value={report.externalOrganization} onChange={(e) => setReport({ ...report, externalOrganization: e.target.value })} />
                        </VStack>
                        <VStack width={400}>
                            <FormLabel width={370} fontSize={15}>Külső szervezet képviselője:</FormLabel>
                            <Input width={350} mr={10} value={report.externalRepresentative} onChange={(e) => setReport({ ...report, externalRepresentative: e.target.value })} />
                        </VStack>
                    </FormControl>
                }
                <Divider my={2} />

                <FormControl width={400} my={2} isReadOnly={!edit}>
                    <FormLabel w={400}>Szolgálat fajtája:</FormLabel>
                    <Select id="type" value={value} onChange={handleChange}>
                        {options.map((option) => {
                            return (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            )
                        })}
                    </Select>
                </FormControl>

                <Textarea value={report.description || ''} onChange={(e) => setReport({ ...report, description: e.target.value })} isReadOnly={!edit} placeholder="Ha történt rendkívüli esemény, annak rövid leírása" width={400} height={100} maxLength={1240} />
            </VStack >
            {/* <Button onClick={() => useReportPDF(id)}>PDF export</Button> */}
        </>
    )
}

export default ReportDetail