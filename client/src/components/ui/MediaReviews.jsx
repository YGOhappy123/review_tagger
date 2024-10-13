import { useState, useEffect, useRef } from 'react'
import { faComments, faPaperPlane, faTrash, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setIsAuthModalOpen } from '../../redux/slices/appSlice'
import { axiosPrivateIns } from '../../libs/axios'
import { formatDateTimeString } from '../../utils/formatDateString'
import { isEmpty } from '../../utils/formValidator'
import getToastOptions from '../../configs/toastConfig'
import CircularNameAvatar from '../common/CircularNameAvatar'

const REVIEWS_PER_PAGE = 4

const MediaReviews = ({ heading, mediaType, media, reviews }) => {
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()

    const [listReviews, setListReviews] = useState([])
    const [filteredReviews, setFilteredReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [reviewCount, setReviewCount] = useState(0)
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const commentsRef = useRef()

    useEffect(() => {
        setListReviews([...reviews])
        setFilteredReviews([...reviews].splice(0, REVIEWS_PER_PAGE))
        setReviewCount(reviews.length)
    }, [reviews])

    const handleLoadMore = () => {
        setFilteredReviews([
            ...filteredReviews,
            ...[...listReviews].splice(currentPage * REVIEWS_PER_PAGE, REVIEWS_PER_PAGE)
        ])
        setCurrentPage((prev) => prev + 1)
    }

    const handleRemoveReviewFromUI = (reviewId) => {
        // New posted comments are only appended to filtered list
        // ... so they wont't be inside full list at that moment
        if (listReviews.findIndex((e) => e._id === reviewId) !== -1) {
            const newListReviews = [...listReviews].filter((e) => e._id !== reviewId)
            setListReviews(newListReviews)
            setFilteredReviews([...newListReviews].splice(0, currentPage * REVIEWS_PER_PAGE))
        } else {
            setFilteredReviews([...filteredReviews].filter((e) => e._id !== reviewId))
        }
        setReviewCount((prev) => prev - 1)
    }

    useEffect(() => {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight
    }, [filteredReviews])

    const handlePostComment = async (e) => {
        e.preventDefault()
        if (isLoading) return

        if (isEmpty(content)) {
            return toast.info('You cannot post an empty comment', getToastOptions())
        }

        try {
            setIsLoading(true)
            const { data } = await axiosPrivateIns.post('/reviews', {
                content,
                mediaId: media.id,
                mediaType,
                mediaTitle: media.title || media.name,
                mediaPoster: media.poster_path
            })

            toast.success(data.message, getToastOptions())
            setFilteredReviews([...filteredReviews, { ...data.data, user }])
            setReviewCount((prev) => prev + 1)
            setContent('')
        } catch (err) {
            toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-3 gap-[75px] lg:gap-8">
            {/* Display comments */}
            <div className="col-span-3 lg:col-span-2">
                <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                    {heading} ({`0${reviewCount}`.slice(-2)})
                </h2>

                <div className="mb-10 max-h-[400px] overflow-y-scroll scroll-smooth" ref={commentsRef}>
                    {filteredReviews.map((item) => (
                        <ReviewItem key={item._id} review={item} handleRemoveReviewFromUI={handleRemoveReviewFromUI} />
                    ))}
                </div>

                {filteredReviews.length < listReviews.length && (
                    <button
                        className="rounded-full bg-gradient-main px-10 py-[10px] text-[14px] font-medium uppercase tracking-wider text-white hover:opacity-90"
                        onClick={handleLoadMore}
                    >
                        <FontAwesomeIcon icon={faComments} />
                        <span className="ml-3">Load More</span>
                    </button>
                )}
            </div>

            {/* Add comment */}
            <div className="col-span-3 lg:col-span-1">
                <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                    Leave a comment
                </h2>

                {user ? (
                    <div>
                        <div className="mb-5 flex items-center gap-5">
                            <CircularNameAvatar name={user.fullName} />
                            <p className="text-lg font-semibold text-white">{user.fullName}</p>
                        </div>
                        <form onSubmit={handlePostComment}>
                            <textarea
                                type="text"
                                className="mb-5 block min-h-[180px] w-full rounded border-2 border-neutral-500 bg-transparent px-3 py-2 font-medium leading-[2.15] text-white caret-primary outline-none focus:border-primary motion-reduce:transition-none"
                                placeholder="Share your idea..."
                                spellCheck={false}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <button
                                className="rounded bg-gradient-main px-8 py-2 font-medium uppercase text-white hover:opacity-90 lg:w-full"
                                type="submit"
                            >
                                {isLoading ? (
                                    <FontAwesomeIcon icon={faRotate} className="animate-spin" />
                                ) : (
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                )}
                                <span className="ml-3">Post</span>
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5">
                        <h2 className="px-5 text-center text-lg font-semibold text-white">
                            You must be logged in to post a comment!
                        </h2>
                        <button
                            className="rounded bg-gradient-main px-5 py-2 font-medium uppercase text-white hover:opacity-90 lg:px-8"
                            onClick={() => dispatch(setIsAuthModalOpen(true))}
                        >
                            Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const ReviewItem = ({ review, handleRemoveReviewFromUI }) => {
    const user = useSelector((state) => state.user.user)
    const [isLoading, setIsLoading] = useState(false)

    const handleRemoveReviewFromDB = async () => {
        if (isLoading) return

        try {
            setIsLoading(true)
            const { data } = await axiosPrivateIns.delete(`/reviews/${review._id}`)

            toast.success(data.message, getToastOptions())
            handleRemoveReviewFromUI(review._id)
        } catch (err) {
            toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mb-5 mr-5 flex gap-5 rounded p-5 text-white last:mb-0 hover:bg-[#212121]">
            <CircularNameAvatar name={review.user.fullName} />

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h6 className="mb-1 text-lg font-semibold">{review.user.fullName}</h6>
                        <p className="text-sm font-medium text-secondary">{formatDateTimeString(review.createdAt)}</p>
                    </div>

                    {user && user._id === review.user._id && (
                        <button
                            className="rounded bg-gradient-main px-5 py-2 font-medium uppercase text-white hover:opacity-90 lg:px-8"
                            onClick={handleRemoveReviewFromDB}
                        >
                            {isLoading ? (
                                <FontAwesomeIcon icon={faRotate} className="animate-spin" />
                            ) : (
                                <FontAwesomeIcon icon={faTrash} />
                            )}
                            <span className="ml-3">Remove</span>
                        </button>
                    )}
                </div>

                <p className="mt-4">{review.content}</p>
                <div className="mt-4 flex items-center gap-2 text-base font-medium text-neutral-500">
                    Tags:{' '}
                    {review.tags.length > 0 ? (
                        <div className="flex gap-3">
                            {review.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center justify-center rounded-3xl bg-neutral-500 px-4 py-0.5 text-black"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="italic">(None)</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MediaReviews
