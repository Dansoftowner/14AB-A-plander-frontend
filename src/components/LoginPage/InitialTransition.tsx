import { motion } from 'framer-motion'
const blackScreen = {
    initial: {
        height: "100vh",
        bottom: 0,
    },
    animate: {
        height: 0,
        transition: {
            when: "afterChildren",
            duration: 1.5,
            ease: [0.87, 0, 0.13, 1],
        },
    },
}

const textContainer = {
    initial: {
        opacity: 1,
    },
    animate: {
        opacity: 0,
        transition: {
            duration: 0.25,
            when: "afterChildren",
        },
    },
};
<motion.svg variants={textContainer} className="absolute z-50 flex" />

const text = {
    initial: {
        y: 40,
    },
    animate: {
        y: 80,
        transition: {
            duration: 1.5,
            ease: [0.87, 0, 0.13, 1],
        },
    },
};
<motion.rect
    variants={text}
    className="w-full h-full text-gray-600 fill-current"
/>

export const InitialTransition = () => {
    return (
        <div className='absolute inset-0 flex items-center justify-center'>
            <motion.div
                className='relative w-full bg-black'
                initial='initial'
                animate='animate'
                variants={blackScreen}
                onAnimationStart={() => document.body.classList.add('overflow-hidden')}
                onAnimationComplete={() =>
                    document.body.classList.remove('overflow-hidden')
                }
            >
                <motion.svg variants={textContainer} className="absolute flex">
                    <pattern
                        id='pattern'
                        patternUnits='userSpaceOnUse'
                        width={750}
                        height={800}
                        className="text-white"
                    >
                        <rect className='w-full h-full fill-current' />
                        <motion.rect variants={text} className='w-full h-full fill-current text-gray-600' />
                    </pattern>
                    <text
                        z-index={1}
                        className='text-4xl font-bold text-white'
                        text-anchor='middle'
                        x='50%'
                        y='50%'
                        fill={`url(#pattern)`}
                        style={{ fill: `url(#pattern)` }}>
                        Plander
                    </text>
                </motion.svg>
            </motion.div>
        </div>
    )
}
