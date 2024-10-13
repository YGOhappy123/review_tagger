import { useEffect } from 'react'

const useBodyBgColor = (color) => {
    useEffect(() => {
        document.body.style.backgroundColor = color
        return () => {
            document.body.style.backgroundColor = 'unset'
        }
    }, [color])
}

export default useBodyBgColor
