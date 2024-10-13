import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm, faRotate, faTv } from '@fortawesome/free-solid-svg-icons'

import { axiosPublicIns } from '../libs/axios'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import useTitle from '../hooks/useTitle'
import usePreviousValue from '../hooks/usePreviousValue'
import HeroSlider from '../components/ui/HeroSlider'
import MediaGrid from '../components/ui/MediaGrid'

const MEDIA_CATEGORIES_BTN = [
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' }
]

const MediaListPage = () => {
    const { mediaType } = useParams()
    const prevMediaType = usePreviousValue(mediaType)
    const dispatch = useDispatch()

    const [medias, setMedias] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentCategory, setCurrentCategory] = useState('popular')
    const [currentPage, setCurrentPage] = useState(1)

    useTitle('FlqCine | Media List')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [mediaType])

    useEffect(() => {
        const getMedia = async () => {
            try {
                if (currentPage === 1) dispatch(setIsGlobalLoading(true))
                setIsLoading()

                const { data } = await axiosPublicIns.get(
                    `${mediaType}/${currentCategory}?page=${currentPage}`
                )

                setMedias((prev) =>
                    currentPage === 1
                        ? data.data.results
                        : [...prev, ...data.data.results]
                )
            } catch (err) {
                return toast.error(
                    'Oops! There was an error loading media',
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
                setIsLoading(false)
            }
        }

        if (mediaType !== prevMediaType) {
            setCurrentCategory('popular')
            setCurrentPage(1)
        }

        getMedia()
    }, [mediaType, currentCategory, currentPage, prevMediaType])

    useEffect(() => {
        setMedias([])
        setCurrentPage(1)
    }, [currentCategory])

    const handleLoadMore = () => setCurrentPage((prev) => prev + 1)

    return (
        <div className='-mt-[72px]'>
            <HeroSlider mediaType={mediaType} mediaCategory={currentCategory} />

            <main className='mx-auto flex max-w-[1366px] flex-col bg-white px-4 py-[75px]'>
                <div className='relative mb-10 flex items-center justify-between border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                    <span>
                        {mediaType === 'movie' ? 'Movies' : 'TV Series'}
                    </span>
                    <div className='flex gap-8'>
                        {MEDIA_CATEGORIES_BTN.map((item) => (
                            <div
                                key={item.value}
                                className='flex items-center gap-2'
                            >
                                <input
                                    type='radio'
                                    className="relative h-5 w-5 appearance-none rounded-full border-2 border-solid border-[#717171] outline-none after:absolute after:left-1/2 after:top-1/2 after:h-[0.625rem] after:w-[0.625rem] after:rounded-full after:content-[''] after:[transform:translate(-50%,-50%)] checked:border-primary checked:after:bg-primary hover:cursor-pointer"
                                    value={item.value}
                                    checked={currentCategory === item.value}
                                    onChange={(e) =>
                                        setCurrentCategory(e.target.value)
                                    }
                                    id={item.value}
                                />
                                <label
                                    htmlFor={item.value}
                                    className='inline-block pl-[0.15rem] text-lg font-medium uppercase text-[#717171] hover:cursor-pointer'
                                >
                                    {item.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <MediaGrid medias={medias} mediaType={mediaType} />

                <button
                    className='mt-10 self-center rounded-full bg-gradient-main px-40 py-4 font-medium uppercase tracking-wider text-white hover:opacity-90'
                    onClick={handleLoadMore}
                >
                    {isLoading ? (
                        <FontAwesomeIcon
                            icon={faRotate}
                            size='xl'
                            className='animate-spin'
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={mediaType === 'movie' ? faPhotoFilm : faTv}
                            size='xl'
                        />
                    )}
                    <span className='ml-5'>Load More</span>
                </button>
            </main>
        </div>
    )
}

export default MediaListPage
