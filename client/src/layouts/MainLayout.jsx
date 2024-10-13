import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setFavoritesList } from '../redux/slices/userSlice'
import userService from '../services/userService'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import GlobalLoading from '../components/layout/GlobalLoading'
import AuthModal from '../components/layout/AuthModal'
import Sidebar from '../components/layout/Sidebar'

const MainLayout = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)
    const { getInfo, fetchFavoritesList } = userService()

    // Load user data (if access token is still valid)
    useEffect(() => {
        getInfo()
    }, [])

    // Load favorites list (when user logged in or data restored by access token)
    useEffect(() => {
        if (user) {
            fetchFavoritesList()
        } else {
            dispatch(setFavoritesList([]))
        }
    }, [user])

    return (
        <>
            <GlobalLoading />
            <AuthModal />
            <Sidebar />

            <div className='min-h-screen'>
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>

            <Footer />
        </>
    )
}

export default MainLayout
