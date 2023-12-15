import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import loginTranslationEN from '../public/locales/en/login.json'
import loginTranslationHU from '../public/locales/hu/login.json'

import commonTranslationHU from '../public/locales/hu/translation.json'
import commonTranslationEN from '../public/locales/en/translation.json'

import registerTranslationEN from '../public/locales/en/register.json'
import registerTranslationHU from '../public/locales/hu/register.json'

const resources = {
  en: {
    login: loginTranslationEN,
    register: registerTranslationEN,
    common: commonTranslationEN,
  },
  hu: {
    login: loginTranslationHU,
    register: registerTranslationHU,
    common: commonTranslationHU,
  },
}

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  resources,
  defaultNS: 'common',
  fallbackLng: 'hu',
  debug: true,
})

export default i18n
