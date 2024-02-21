import { FormEvent } from 'react'

const lengths: number[] = [2, 7]
let prevValue = 0
export const guardNumberHandler = (e: FormEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  if (lengths.includes(target.value.length) && prevValue != 2 && prevValue != 7)
    target.value += '/'
  if (target.value.length >= 1) prevValue = target.value.length - 1
}

const spacePos = [2, 6]
let prevTelValue = 0
export const telHandler = (e: FormEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  if (
    spacePos.includes(target.value.length) &&
    prevTelValue != 2 &&
    prevTelValue != 6
  )
    target.value += ' '
  if (target.value.length >= 1) prevTelValue = target.value.length - 1
}
