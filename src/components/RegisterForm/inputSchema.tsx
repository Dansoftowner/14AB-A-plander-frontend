import { z } from 'zod'
import i18n from '../../i18n'
import { TFunction } from 'i18next'

export const schema = (t: TFunction) => z.object({
    username: z.string().min(5, { message: i18n.t('regForm-zodUsername') }).max(20),
    password: z.string().min(8, { message: t('regForm-zodPasswordLength') }).refine((str) => /[A-Z]/.test(str), { message: t('regForm-zodPassword') }).refine(str => /[0-9]/.test(str), { message: t('regForm-zodPassword') }),
    repeatedPassword: z.string(),
    fullName: z.string().min(5, { message: t('regForm-zodFullname') }).max(40).refine(str => /^[^\d]+\s+[^\d]+(\s[^\d]+)*$/g.test(str), { message: t('regForm-zodInvalidName') })
        .refine(str => !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str), { message: t('regForm-zodInvalidName') }),
    address: z.string().min(5, { message: t('regForm-zodAddress') }).refine(str => /[0-9]/.test(str), { message: t('regForm-zodAddress') }),
    idNumber: z.string().min(3),
    guardNumber: z.string().min(1, { message: t('regForm-zodGuardNumber') }).max(13).refine(str => /\d{2}\/\d{4}\/\d{5}/.test(str), { message: t('regForm-zodGuardNumber') }),
    emailAddress: z.string().refine(str => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str), { message: t('regForm-zodEmail') }),
    phoneNumber: z.string().min(1),
})
    .refine(data => data.password == data.repeatedPassword, {
        message: t('regForm-zodRepeatedPwd'),
        path: ["repeatedPassword"]
    })