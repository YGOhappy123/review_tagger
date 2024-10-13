import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHeart,
    faRightFromBracket,
    faKey,
    faComments,
    faBars,
    faHome,
    faPhotoFilm,
    faTv,
    faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'
import {
    setIsAuthModalOpen,
    setIsSidebarOpen
} from '../../redux/slices/appSlice'
import { signOut } from '../../redux/slices/userSlice'
import Logo from '../common/Logo'

export const NAV_ITEMS = [
    {
        label: 'home',
        path: '/',
        icon: <FontAwesomeIcon icon={faHome} />
    },
    {
        label: 'movies',
        path: '/movie',
        icon: <FontAwesomeIcon icon={faPhotoFilm} />
    },
    {
        label: 'tv series',
        path: '/tv',
        icon: <FontAwesomeIcon icon={faTv} />
    },
    {
        label: 'search',
        path: '/search',
        icon: <FontAwesomeIcon icon={faMagnifyingGlass} />
    }
]

const MENU_ITEMS = [
    {
        label: 'Favorites',
        path: '/favorites',
        icon: <FontAwesomeIcon icon={faHeart} size='lg' />
    },
    {
        label: 'Reviews',
        path: '/reviews',
        icon: <FontAwesomeIcon icon={faComments} />
    },
    {
        label: 'Update Password',
        path: '/update-password',
        icon: <FontAwesomeIcon icon={faKey} />
    },
    {
        label: 'Sign Out',
        icon: <FontAwesomeIcon icon={faRightFromBracket} />
    }
]

const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const [isLoading, setIsLoading] = useState(false)
    const [transparentBg, setTransparentBg] = useState(true)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const user = useSelector((state) => state.user.user)
    const isGlobalLoading = useSelector((state) => state.app.isGlobalLoading)

    useEffect(() => {
        if (isGlobalLoading) {
            setIsLoading(true)
        } else {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [isGlobalLoading])

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const scrollThreshold = 50

            if (scrollY > scrollThreshold) {
                setTransparentBg(false)
            } else {
                setTransparentBg(true)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <header
            className={`sticky top-0 z-10 flex h-[72px] items-center justify-between bg-black px-5 lg:px-6 ${
                transparentBg && !isLoading ? 'bg-transparent' : 'bg-black'
            }`}
        >
            <Logo />

            {/* Navigation btn */}
            <div className='hidden h-full gap-3 text-white md:flex lg:gap-4'>
                {NAV_ITEMS.map((item) => (
                    <div
                        key={item.path}
                        className={`relative flex cursor-pointer items-center px-4 py-2 font-medium uppercase tracking-wider hover:text-secondary ${
                            pathname === item.path ? 'text-secondary' : ''
                        }`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>

            <div className='flex items-center gap-5'>
                {user ? (
                    // Dropdown menu
                    <div
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                        className='relative cursor-pointer py-4'
                    >
                        <span className='text-xl lg:px-4'>
                            <span className='hidden font-medium text-white lg:inline'>
                                Welcome,{' '}
                            </span>
                            <span className='bg-gradient-main bg-clip-text font-bold uppercase text-transparent'>
                                {user.fullName}
                            </span>
                        </span>
                        <div className='absolute right-0 top-full'>
                            {isDropdownOpen && (
                                <ul className='list-none rounded bg-dropdown py-2'>
                                    {MENU_ITEMS.map((item) => (
                                        <li
                                            key={item.label}
                                            className='flex items-center px-6 py-2 text-white hover:bg-dropdownHover'
                                            onClick={() => {
                                                if (item.path) {
                                                    navigate(item.path)
                                                } else {
                                                    dispatch(signOut())
                                                }
                                            }}
                                        >
                                            <span className='flex w-10 items-center'>
                                                {item?.icon}
                                            </span>
                                            <span className='w-max font-medium uppercase'>
                                                {item.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    // Sign in btn
                    <button
                        className='rounded bg-gradient-main px-5 py-2 font-medium uppercase text-white hover:opacity-90 lg:px-8'
                        onClick={() => dispatch(setIsAuthModalOpen(true))}
                    >
                        Sign In
                    </button>
                )}

                <button
                    className='md:hidden'
                    onClick={() => dispatch(setIsSidebarOpen(true))}
                >
                    <FontAwesomeIcon
                        icon={faBars}
                        size='2x'
                        className='mt-1 text-white'
                    />
                </button>
            </div>
        </header>
    )
}

export default Navbar
