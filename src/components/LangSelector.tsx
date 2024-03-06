import { Button, Image } from '@chakra-ui/react'
import { useTranslation } from "react-i18next"
import { usePatchPreferences, useAuth } from '../hooks/hooks'
import { useEffect } from 'react'

export const LangSelector = () => {

    const { preferences, setPreferences } = useAuth()

    const { t, i18n } = useTranslation()

    let selectedLanguage = (preferences?.language || i18n.language)


    const changeLang = () => {
        selectedLanguage == 'en' ? i18n.changeLanguage('hu') : i18n.changeLanguage('en')
        selectedLanguage = i18n.language
        setPreferences({ ...preferences, language: selectedLanguage })
    }

    useEffect(() => {
        selectedLanguage = (preferences?.language || i18n.language)
        i18n.changeLanguage(selectedLanguage)
        usePatchPreferences(preferences)
    }, [preferences])

    return (
        <>
            <Button backgroundColor='transparent' onClick={changeLang}>
                <Image
                    width={26}
                    height={26}
                    alt={t('langSelectorAlt')}
                    title={t('langSelectorAlt')}
                    src={(selectedLanguage == 'hu-HU' || selectedLanguage == 'hu') ? '/assets/flags/hu.svg' : '/assets/flags/gb.svg'} />
            </Button>
        </>
    )
}
