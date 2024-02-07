import * as z from 'zod'

const emailSchema = z.string().email()
const pwdSchema = z
  .string()
  .min(8)
  .refine((str) => /[A-Z]/.test(str), { message: 'szar' })
  .refine((str) => /[0-9]/.test(str))

export const validate = (gNumber: string, email: string, newPwd: string) => {
  if (!pwdSchema.safeParse(newPwd).success) return false
  if (!/^\d{2}\/\d{4}\/\d{5}$/.test(gNumber)) return false
  if (!emailSchema.safeParse(email).success) return false
  return true
}
