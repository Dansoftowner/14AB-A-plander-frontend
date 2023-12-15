import { z } from 'zod'
import { TFunction } from 'i18next'

export const regSchema = (t: TFunction<'register', undefined>) => z.object({
    username: z.string().min(5, { message: t('zodUsername') }).max(20),
    password: z.string().min(8, { message: t('zodPasswordLength') }).refine((str) => /[A-Z]/.test(str), { message: t('zodPassword') }).refine(str => /[0-9]/.test(str), { message: t('zodPassword') }),
    repeatedPassword: z.string(),
    name: z.string().min(5, { message: t('zodFullname') }).max(40).refine(str => /^[^\d]+\s+[^\d]+(\s[^\d]+)*$/g.test(str), { message: t('zodInvalidName') })
        .refine(str => !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str), { message: t('zodInvalidName') }),
    address: z.string().min(5, { message: t('zodAddress') }).refine(str => /[0-9]/.test(str), { message: t('zodAddress') }),
    idNumber: z.string().min(3),
    guardNumber: z.string().min(1, { message: t('zodGuardNumber') }).max(13).refine(str => /\d{2}\/\d{4}\/\d{5}/.test(str), { message: t('zodGuardNumber') }),
    phoneNumber: z.string().min(1),
}).refine(data => data.password == data.repeatedPassword, {
    message: t('zodRepeatedPwd'),
    path: ["repeatedPassword"]
})


export const loginSchema = (t: TFunction) => z.object({
    username: z.string().min(1, { message: 'Kötelező megadni!' }),
    password: z.string().min(1, { message: 'Kötelező megadni!' }),
    association: z.string().min(1, { message: 'Kötelező megadni!' }).optional(),
    autoLogin: z.boolean().default(false)
})