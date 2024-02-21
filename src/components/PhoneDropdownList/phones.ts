
export interface PhoneFormat {
    prefix: string,
    src: string,
    length: number
}

export const phoneMap: PhoneFormat[] = [
    {
       prefix: '+36',
       src: "/assets/flags/hu.svg",
       length: 7
    },
    {
        prefix: '+1',
        src: "/assets/flags/us.svg",
        length: 11
    },
    {
        prefix: '+44',
        src: "/assets/flags/sk.svg",
        length: 10
    },
    {
        prefix: '+40',
        src: "/assets/flags/ro.svg",
        length: 11
    },
    {
        prefix: '+381',
        src: "/assets/flags/rs.svg",
        length: 10
    },
    {
        prefix: '+385',
        src: "/assets/flags/hr.svg",
        length: 11
    },
    {
        prefix: '+43',
        src: "/assets/flags/at.svg",
        length: 11
    },
    {
        prefix: '+386',
        src: "/assets/flags/si.svg",
        length: 11
    },
    {
        prefix: '+380',
        src: "/assets/flags/ua.svg",
        length: 11
    },
]