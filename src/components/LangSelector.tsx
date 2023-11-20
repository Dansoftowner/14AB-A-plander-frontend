import { Button, Image } from '@chakra-ui/react'
import { useTranslation } from "react-i18next"

export const LangSelector = () => {

    const { t, i18n } = useTranslation()
    const selectedLanguage = i18n.language

    const changeLang = () => {
        selectedLanguage == 'hu' ? i18n.changeLanguage('en') : i18n.changeLanguage('hu')
    }

    return (
        <>
            <Button backgroundColor='transparent' onClick={changeLang}>
                <Image
                    width={26}
                    height={26}
                    alt={t('langSelectorAlt')}
                    title={t('langSelectorAlt')}
                    src={selectedLanguage == 'hu' ? '/assets/HU.svg' : '/assets/GB.svg'} />
            </Button>
        </>
    )
}
