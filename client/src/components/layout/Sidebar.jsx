import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { setIsSidebarOpen } from '../../redux/slices/appSlice'
import { NAV_ITEMS } from './Navbar'
import Logo from '../common/Logo'

const Sidebar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const isSidebarOpen = useSelector((state) => state.app.isSidebarOpen)

    const handleClick = (path) => {
        dispatch(setIsSidebarOpen(false))
        navigate(path)
    }

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth
            if (windowWidth >= 768) {
                dispatch(setIsSidebarOpen(false))
            }
        }
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div
            className='fixed left-0 top-0 z-[200] h-screen w-screen overflow-hidden bg-modalOverlay'
            onClick={() => dispatch(setIsSidebarOpen(false))}
            style={{ width: isSidebarOpen ? '100vw' : 0 }}
        >
            <div
                className='absolute left-0 top-0 flex h-full origin-left flex-col items-center overflow-hidden bg-black py-12 transition-all duration-300 ease-in-out'
                style={{ width: isSidebarOpen ? 300 : 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className='absolute right-4 top-4 cursor-pointer text-secondary hover:scale-90'
                    onClick={() => dispatch(setIsSidebarOpen(false))}
                >
                    <FontAwesomeIcon icon={faTimes} size='2x' />
                </div>

                <div
                    className='mb-10 flex scale-90 justify-center'
                    onClick={() => dispatch(setIsSidebarOpen(false))}
                >
                    <Logo />
                </div>

                <div className='flex flex-col items-center gap-3 text-white'>
                    {NAV_ITEMS.map((item) => (
                        <div
                            key={item.path}
                            className={`relative flex cursor-pointer items-center gap-3 px-4 py-2 font-medium uppercase tracking-wider hover:text-secondary ${
                                pathname === item.path ? 'text-secondary' : ''
                            }`}
                            onClick={() => handleClick(item.path)}
                        >
                            {item.icon}
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
