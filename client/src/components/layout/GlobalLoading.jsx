import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const GlobalLoading = () => {
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const isGlobalLoading = useSelector((state) => state.app.isGlobalLoading)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) =>
                prevProgress >= 100 ? 0 : prevProgress + 1
            )
        }, 15)

        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        if (isGlobalLoading) {
            setIsLoading(true)
        } else {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [isGlobalLoading])

    return (
        <div
            className='pointer-events-none fixed left-0 top-0 z-[100] h-screen w-screen bg-modalOverlay'
            style={{ opacity: isLoading ? 1 : 0 }}
        >
            <div className='relative mt-[72px] h-1 w-full overflow-hidden bg-secondary brightness-90'>
                <div
                    className='absolute left-0 h-full w-2/5 bg-primary'
                    style={{ left: `${progress}%` }}
                ></div>
            </div>
        </div>
    )
}

export default GlobalLoading
