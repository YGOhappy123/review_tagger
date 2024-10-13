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

const REVIEWS_PER_PAGE = 3

const MyReviewsPage = () => {
    const dispatch = useDispatch()
    useTitle('FlqCine | My Reviews')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [reviews, setReviews] = useState([])
    const [filteredReviews, setFilteredReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const getReviews = async () => {
            try {
                dispatch(setIsGlobalLoading(false))

                const { data } = await axiosPrivateIns.get('/reviews')

                setReviews(data.data)
                setFilteredReviews([...data.data].splice(0, REVIEWS_PER_PAGE))
                setCount(data.data.length)
            } catch (err) {
                return toast.error(
                    'Oops! There was an error loading your reviews',
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        getReviews()
    }, [])

    const handleLoadMore = () => {
        setFilteredReviews([
            ...filteredReviews,
            ...[...reviews].splice(
                currentPage * REVIEWS_PER_PAGE,
                REVIEWS_PER_PAGE
            )
        ])
        setCurrentPage((prev) => prev + 1)
    }

    const handleRemoveReviewFromUI = (reviewId) => {
        const newReviews = [...reviews].filter(
            (review) => review._id !== reviewId
        )
        setReviews(newReviews)
        setFilteredReviews(
            [...newReviews].splice(0, currentPage * REVIEWS_PER_PAGE)
        )
        setCount((prev) => prev - 1)
    }

    return (
        <div>
            <main className='mx-auto flex max-w-[1366px] flex-col px-4 py-[75px]'>
                <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                    Your Reviews ({`0${count}`.slice(-2)})
                </h2>

                <div className='-mr-5 mb-10'>
                    {filteredReviews.map((item) => (
                        <ReviewItem
                            key={item._id}
                            review={item}
                            handleRemoveReviewFromUI={handleRemoveReviewFromUI}
                        />
                    ))}
                </div>

                {filteredReviews.length < reviews.length && (
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

const ReviewItem = ({ review, handleRemoveReviewFromUI }) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleRemoveReviewFromDB = async (e) => {
        e.stopPropagation()
        if (isLoading) return

        try {
            setIsLoading(true)
            const { data } = await axiosPrivateIns.delete(
                `/reviews/${review._id}`
            )

            toast.success(data.message, getToastOptions())
            handleRemoveReviewFromUI(review._id)
        } catch (err) {
            toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className='mb-5 mr-5 flex cursor-pointer gap-5 rounded p-5 text-white last:mb-0 hover:bg-[#212121]'
            onClick={() => navigate(`/${review.mediaType}/${review.mediaId}`)}
        >
            <div className='w-0 md:w-[10%]'>
                <div
                    className='rounded bg-imgAlt bg-cover pt-[150%]'
                    style={{
                        backgroundImage: `url(${tmdbConfig.posterPath(
                            review.mediaPoster
                        )})`
                    }}
                ></div>
            </div>

            <div className='flex-1'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h6 className='mb-1 text-lg font-semibold'>
                            {review.mediaTitle}
                        </h6>
                        <p className='text-sm font-medium text-secondary'>
                            {formatDateTimeString(review.createdAt)}
                        </p>
                    </div>

                    <button
                        className='rounded bg-gradient-main px-5 py-2 font-medium uppercase text-white hover:opacity-90 lg:px-8'
                        onClick={handleRemoveReviewFromDB}
                    >
                        {isLoading ? (
                            <FontAwesomeIcon
                                icon={faRotate}
                                className='animate-spin'
                            />
                        ) : (
                            <FontAwesomeIcon icon={faTrash} />
                        )}
                        <span className='ml-3'>Remove</span>
                    </button>
                </div>

                <p className='mt-4'>{review.content}</p>
            </div>
        </div>
    )
}

export default MyReviewsPage
