import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComments,
    faTrash,
    faRotate
} from '@fortawesome/free-solid-svg-icons'
import { axiosPrivateIns } from '../libs/axios'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import { formatDateTimeString } from '../utils/formatDateString'
import tmdbConfig from '../configs/tmdbConfig'
import getToastOptions from '../configs/toastConfig'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import FavoriteTag from '../components/common/FavoriteTag'

const ITEMS_PER_PAGE = 5

const MyFavoritesPage = () => {
    const dispatch = useDispatch()
    useTitle('FlqCine | My Favorite List')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [favoriteList, setFavoriteList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const getFavoriteList = async () => {
            try {
                dispatch(setIsGlobalLoading(false))

                const { data } = await axiosPrivateIns.get('/user/favorites')

                setFavoriteList(data.data)
                setFilteredList([...data.data].splice(0, ITEMS_PER_PAGE))
                setCount(data.data.length)
            } catch (err) {
                return toast.error(
                    'Oops! There was an error loading your favorite list',
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        getFavoriteList()
    }, [])

    const handleLoadMore = () => {
        setFilteredList([
            ...filteredList,
            ...[...favoriteList].splice(
                currentPage * ITEMS_PER_PAGE,
                ITEMS_PER_PAGE
            )
        ])
        setCurrentPage((prev) => prev + 1)
    }

    const handleRemoveReviewFromUI = (itemId) => {
        const newFavoriteList = [...favoriteList].filter(
            (item) => item._id !== itemId
        )
        setFavoriteList(newFavoriteList)
        setFilteredList(
            [...newFavoriteList].splice(0, currentPage * ITEMS_PER_PAGE)
        )
        setCount((prev) => prev - 1)
    }

    return (
        <div>
            <main className='mx-auto flex max-w-[1366px] flex-col px-4 py-[75px]'>
                <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[240px] after:bg-gradient-main after:content-[""]'>
                    Your Favorite List ({`0${count}`.slice(-2)})
                </h2>

                <div className='mb-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                    {filteredList.map((item) => (
                        <FavoriteItem
                            key={item._id}
                            item={item}
                            handleRemoveReviewFromUI={handleRemoveReviewFromUI}
                        />
                    ))}
                </div>

                {filteredList.length < favoriteList.length && (
                    <button
                        className='self-center rounded-full bg-gradient-main px-40 py-4 font-medium uppercase tracking-wider text-white hover:opacity-90'
                        onClick={handleLoadMore}
                    >
                        <FontAwesomeIcon icon={faComments} />
                        <span className='ml-3'>Load More</span>
                    </button>
                )}
            </main>
        </div>
    )
}

const FavoriteItem = ({ item, handleRemoveReviewFromUI }) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleRemoveReviewFromDB = async (e) => {
        e.stopPropagation()
        if (isLoading) return

        try {
            setIsLoading(true)
            const { data } = await axiosPrivateIns.delete(
                `/user/favorites/${item._id}`
            )

            toast.success(data.message, getToastOptions())
            handleRemoveReviewFromUI(item._id)
        } catch (err) {
            toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className='relative cursor-pointer overflow-hidden rounded-[10px] before:absolute before:-left-[140px] before:bottom-0 before:h-[105%] before:w-0 before:skew-x-[30deg] before:bg-gradient-main before:opacity-90 before:duration-500 before:content-[""] hover:before:w-[230%] [&:hover>aside]:scale-100 [&:hover>aside]:opacity-100'
            onClick={() => navigate(`/${item.mediaType}/${item.mediaId}`)}
        >
            <div
                className='bg-imgAlt bg-cover pt-[150%]'
                style={{
                    backgroundImage: `url(${tmdbConfig.posterPath(
                        item.mediaPoster
                    )})`
                }}
            ></div>

            <FavoriteTag />

            <aside className='absolute left-0 top-0 z-[1] flex h-full w-full scale-90 flex-col items-center justify-center p-5 text-center font-medium text-white opacity-0 delay-100 duration-300'>
                <button
                    className='mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white duration-200 hover:scale-90 hover:opacity-90'
                    onClick={handleRemoveReviewFromDB}
                >
                    {isLoading ? (
                        <FontAwesomeIcon
                            icon={faRotate}
                            size='lg'
                            className='animate-spin'
                        />
                    ) : (
                        <FontAwesomeIcon icon={faTrash} size='lg' />
                    )}
                </button>
                <span className='mb-2 text-lg'>{item.mediaTitle}</span>

                <span className='text-sm'>
                    Added: {formatDateTimeString(item.createdAt)}
                </span>
            </aside>
        </div>
    )
}

export default MyFavoritesPage
