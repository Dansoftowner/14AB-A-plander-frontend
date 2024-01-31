import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import loginTranslationEN from '../src/locales/en/login.json'
import loginTranslationHU from '../src/locales/hu/login.json'

import commonTranslationHU from '../src/locales/hu/translation.json'
import commonTranslationEN from '../src/locales/en/translation.json'

import registerTranslationEN from '../src/locales/en/register.json'
import registerTranslationHU from '../src/locales/hu/register.json'

import memberTranslationHU from '../src/locales/hu/member.json'
import memberTranslationEN from '../src/locales/en/member.json'

import assignmentsTranslationHU from '../src/locales/hu/assignments.json'
import assignmentsTranslationEN from '../src/locales/en/assignments.json'

const resources = {
  en: {
    login: loginTranslationEN,
    register: registerTranslationEN,
    common: commonTranslationEN,
    member: memberTranslationEN,
    assignments: assignmentsTranslationEN,
  },
  hu: {
    login: loginTranslationHU,
    register: registerTranslationHU,
    common: commonTranslationHU,
    member: memberTranslationHU,
    assignments: assignmentsTranslationHU,
  },
}

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  resources,
  defaultNS: 'common',
  fallbackLng: 'hu',
  debug: true,
})

export default i18n
