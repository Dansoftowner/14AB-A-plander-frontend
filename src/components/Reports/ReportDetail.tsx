
import { Divider, FormControl, FormLabel, HStack, Text, Input, Radio, RadioGroup, VStack, Textarea, Select } from "@chakra-ui/react"
import { User, useAuth } from "../../hooks/hooks"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Report, useReport } from "../../hooks/useReports"
import { subDays } from "date-fns"
import { useTranslation } from "react-i18next"

interface Props {
    id: string
    assignees: User[]
    report: Report,
    setReport: Dispatch<SetStateAction<Report>>,
    setCanEdit: Dispatch<SetStateAction<boolean>>,
    edit: boolean
}


const ReportDetail = ({ assignees, report, setReport, id, setCanEdit, edit }: Props) => {



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
    const { t } = useTranslation('assignments')

    const canEdit = (type: 'patch' | 'add', report: Report | undefined | void) => {
        if (report == undefined) {
            return assignees.map(r => r._id).includes(user._id)
        }
        return (new Date(report.submittedAt) > subDays(new Date(), 3)) &&
            (type == 'add' ? assignees.map(r => r._id).includes(user._id)
                : user._id == report.author)
    }
    const { data, isFetching, error, status } = useReport(id)

    useEffect(() => {
        setReport({} as Report)
        if (data && !isFetching && status == "success") {
            setReport(data)
            if (data?.externalOrganization || data?.externalRepresentative) {
                setIndependent('2')
            } else setIndependent('1')
            setValue(data.purpose)
            setCanEdit(canEdit('patch', data))
        } else if (error) {
            setCanEdit(canEdit('add', data))
        }
    }, [isFetching, id])

    return (
        <>
            <VStack >
                <FormControl my={5} isRequired isReadOnly={!edit} maxW='90vw'>
                    <FormLabel>{t('reportMethod')}:</FormLabel>
                    <RadioGroup onChange={(e) => setReport({ ...report, method: e })} value={report.method}>
                        <Radio mx={2} value="vehicle">{t('vehicle')}</Radio>
                        <Radio mx={2} value="bicycle">{t('bicycle')}</Radio>
                        <Radio mx={2} value="pedestrian">{t('pedestrian')}</Radio>
                    </RadioGroup>
                </FormControl>

                {report.method == 'vehicle' &&
                    <FormControl isReadOnly={!edit} maxW='90vw'>
                        <HStack my={2}>
                            <FormLabel width={200} fontSize={15}>{t('licenseplate')}:</FormLabel>
                            <Input width={140} value={report.licensePlateNumber} onChange={(e) => setReport({ ...report, licensePlateNumber: e.target.value })}></Input>
                        </HStack>
                        <HStack >
                            <FormLabel width={118} fontSize={15}>{t('km')}:</FormLabel>
                            <Input type="number" width={100} value={report.startKm} onChange={(e) => setReport({ ...report, startKm: parseInt(e.target.value) || undefined })}></Input>
                            <Text my={0}>-</Text>
                            <Input type="number" width={100} value={report.endKm} onChange={(e) => setReport({ ...report, endKm: parseInt(e.target.value) || undefined })}></Input>
                        </HStack>
                    </FormControl>
                }
                <Divider my={2} />

                <HStack width={400} maxW='90vw'>
                    <FormControl isRequired isReadOnly={!edit}>
                        <FormLabel>{t('assignmentType')}:</FormLabel>
                        <RadioGroup onChange={setIndependent} value={independent}>
                            <Radio mx={2} value="1">{t('independent')}</Radio>
                            <Radio mx={2} value="2">{t('corporate')}</Radio>
                        </RadioGroup>
                    </FormControl>
                </HStack>
                {independent == "2" &&
                    <FormControl isReadOnly={!edit} maxW='90vw'>
                        <VStack width={400}>
                            <FormLabel width={370} fontSize={15}>{t('externalOrg')}:</FormLabel>
                            <Input width={350} mr={10} value={report.externalOrganization} onChange={(e) => setReport({ ...report, externalOrganization: e.target.value })} />
                        </VStack>
                        <VStack width={400}>
                            <FormLabel width={370} fontSize={15}>{t('externalRep')}:</FormLabel>
                            <Input width={350} mr={10} value={report.externalRepresentative} onChange={(e) => setReport({ ...report, externalRepresentative: e.target.value })} />
                        </VStack>
                    </FormControl>
                }
                <Divider my={2} />

                <FormControl width={400} my={2} maxW='90vw' isReadOnly={!edit}>
                    <FormLabel w={400}>{t('purpose')}:</FormLabel>
                    <Select id="type" value={value} isDisabled={!edit} onChange={handleChange}>
                        {options.map((option) => {
                            return (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            )
                        })}
                    </Select>
                </FormControl>

                <Textarea maxW='90vw' value={report.description || ''} onChange={(e) => setReport({ ...report, description: e.target.value })} isReadOnly={!edit} placeholder="Ha történt rendkívüli esemény, annak rövid leírása" width={400} height={100} maxLength={1240} />
            </VStack >
        </>
    )
}

export default ReportDetail