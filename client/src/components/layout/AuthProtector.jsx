import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useTitle from '../../hooks/useTitle'
import useBodyBgColor from '../../hooks/useBodyBgColor'
import ContentNotFound from '../common/ContentNotFound'

const AuthProtector = ({ children }) => {
    const user = useSelector((state) => state.user.user)

    useTitle('FlqCine | Auth Required')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (!user)
        return (
            <ContentNotFound
                text={'You must be logged in to enter this page!'}
            />
        )

    return <>{children}</>
}

export default AuthProtector
