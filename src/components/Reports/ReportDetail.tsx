import { Button } from "@chakra-ui/react"
import { useReport, useReportPDF } from "../../hooks/hooks"

interface Props {
    id: string
}


const ReportDetail = ({ id }: Props) => {

    const { data } = useReport(id)

    return (
        <>
            alma
            <Button onClick={() => useReportPDF(id)}>PDF export</Button>
        </>
    )
}

export default ReportDetail