import { useEffect } from 'react'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import ContentNotFound from '../components/common/ContentNotFound'

const NotFoundPage = () => {
    useTitle('FlqCine | Page Not Found')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return <ContentNotFound text={'Page not found!'} bigText='404' />
}

export default NotFoundPage
