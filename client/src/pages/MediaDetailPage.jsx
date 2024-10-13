import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import { axiosPrivateIns } from '../libs/axios'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import {
    addToFavoritesList,
    removeFromFavoritesList
} from '../redux/slices/userSlice'

import { formatDateString } from '../utils/formatDateString'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import tmdbConfig from '../configs/tmdbConfig'
import getToastOptions from '../configs/toastConfig'

import BackgroundPoster from '../components/ui/BackgroundPoster'
import CircularProgress from '../components/common/CircularProgress'
import AddToFavoriteBtn from '../components/common/AddToFavoriteBtn'
import CastSlider from '../components/ui/CastSlider'
import VideoSlider from '../components/ui/VideoSlider'
import BackdropSlider from '../components/ui/BackdropSlider'
import PosterSlider from '../components/ui/PosterSlider'
import MediaSlider from '../components/ui/MediaSlider'
import MediaReviews from '../components/ui/MediaReviews'
import ContentNotFound from '../components/common/ContentNotFound'

const MediaDetailPage = () => {
    const { mediaType, mediaId } = useParams()
    const { user, favoritesList } = useSelector((state) => state.user)
    const isGlobalLoading = useSelector((state) => state.app.isGlobalLoading)
    const dispatch = useDispatch()

    useTitle('FlqCine | Media Detail')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [mediaType, mediaId])

    const [media, setMedia] = useState(null)
    const [genres, setGenres] = useState([])
    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteLoading, setFavoriteLoading] = useState(false)
    const videoSectionRef = useRef(null)

    useEffect(() => {
        const getMedia = async () => {
            try {
                dispatch(setIsGlobalLoading(true))
                const { data } = await axiosPrivateIns.get(
                    `${mediaType}/detail/${mediaId}`
                )

                setMedia(data.data)
                setGenres(data.data.genres)
                setIsFavorite(data.data.isFavorite)
            } catch (err) {
                return toast.error(
                    `Oops! There was an error loading media`,
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        getMedia()
    }, [mediaType, mediaId])

    const getGenresString = useCallback(
        (separator = ',') => {
            return genres.map((item) => item.name).join(`${separator} `)
        },
        [genres]
    )

    const handleFavoriteBtnClick = async () => {
        if (!user) {
            return toast.info(
                'You have to login to perform this action',
                getToastOptions()
            )
        }

        if (favoriteLoading) return
        if (isFavorite) {
            return removeFavoriteItem()
        }

        try {
            setFavoriteLoading(true)
            const { data } = await axiosPrivateIns.post('/user/favorites', {
                mediaId: media.id,
                mediaTitle: media.title || media.name,
                mediaType: mediaType,
                mediaPoster: media.poster_path,
                mediaRate: media.vote_average
            })

            toast.success(data.message, getToastOptions())
            setIsFavorite(true)
            dispatch(addToFavoritesList(data.data))
        } catch (err) {
            toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setFavoriteLoading(false)
        }
    }

    const removeFavoriteItem = async () => {
        if (favoriteLoading) return

        const target = favoritesList.find(
            (item) => item.mediaId.toString() === media.id.toString()
        )

        console.log(target)

        try {
            setFavoriteLoading(true)
            const { data } = await axiosPrivateIns.delete(
                `/user/favorites/${target._id}`
            )

            toast.success(data.message, getToastOptions())
            setIsFavorite(false)
            dispatch(removeFromFavoritesList({ mediaId: target.mediaId }))
        } catch (err) {
            toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setFavoriteLoading(false)
        }
    }

    if (!media) {
        if (isGlobalLoading) return null
        return (
            <ContentNotFound
                text={'The media data you requested is not exist!'}
            />
        )
    }

    return (
        <div className='-mt-[72px]'>
            <BackgroundPoster
                posterPath={tmdbConfig.backdropPath(
                    media.backdrop_path || media.poster_path
                )}
            />

            <main className='mx-auto max-w-[1366px] px-4'>
                {/* Media content */}
                <div className='-mt-40 pb-[75px] lg:-mt-60 xl:-mt-80'>
                    <div className='flex flex-col md:flex-row'>
                        <div className='mx-auto mb-8 w-[70%] sm:w-1/2 md:ml-0 md:mr-8 md:w-2/5'>
                            <div
                                className='rounded bg-cover bg-center pt-[140%]'
                                style={{
                                    backgroundImage: `url(${tmdbConfig.backdropPath(
                                        media.poster_path || media.backdrop_path
                                    )})`
                                }}
                            ></div>
                        </div>

                        <div className='flex h-full w-full flex-col justify-center text-white md:w-2/3'>
                            <h4 className='mb-5 text-3xl font-medium md:text-5xl md:leading-[1.3] lg:text-6xl lg:leading-[1.3]'>
                                {media.title || media.name}
                            </h4>
                            <span className='mb-3 font-medium uppercase text-secondary'>
                                {getGenresString(',')}
                            </span>
                            {media.overview && (
                                <p className='mb-3'>{media.overview}</p>
                            )}
                            <p className='mb-3'>
                                Original language:{' '}
                                <span className='uppercase'>
                                    {media.original_language}
                                </span>
                            </p>
                            <p className='mb-5 xl:mb-10'>
                                Released data:{' '}
                                {formatDateString(media.release_date)}
                            </p>
                            <div className='mb-5 flex items-center gap-5 xl:mb-10'>
                                <CircularProgress
                                    size={60}
                                    value={media.vote_average}
                                />
                                {media?.videos?.results?.length > 0 && (
                                    <button
                                        className='rounded-full bg-gradient-main px-6 py-[10px] text-[14px] font-medium uppercase tracking-wider text-white hover:opacity-90'
                                        onClick={() =>
                                            videoSectionRef.current.scrollIntoView()
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlay} />
                                        <span className='ml-3'>
                                            Play Trailer
                                        </span>
                                    </button>
                                )}
                                <AddToFavoriteBtn
                                    isFavorite={isFavorite}
                                    loading={favoriteLoading}
                                    onClick={handleFavoriteBtnClick}
                                />
                            </div>
                            <CastSlider
                                heading='Casts'
                                casts={media.credits.cast}
                            />
                        </div>
                    </div>
                </div>

                {/* Media backdrops */}
                {media.images.backdrops.length > 0 && (
                    <div className='pb-[75px]'>
                        <BackdropSlider
                            heading='Backdrops'
                            backdrops={[...media.images.backdrops].splice(
                                0,
                                10
                            )}
                        />
                    </div>
                )}

                {/* Media videos */}
                {media?.videos?.results?.length > 0 && (
                    <div
                        className='scroll-mt-[72px] pb-[75px]'
                        ref={videoSectionRef}
                    >
                        <VideoSlider
                            heading='Trailers'
                            videos={[...media.videos.results].splice(0, 5)}
                        />
                    </div>
                )}

                {/* Media posters */}
                {media.images.posters.length > 0 && (
                    <div className='pb-[75px]'>
                        <PosterSlider
                            heading='Posters'
                            posters={[...media.images.posters].splice(0, 10)}
                        />
                    </div>
                )}

                {/* Media reviews */}
                <div className='pb-[75px]'>
                    <MediaReviews
                        heading='Comments'
                        mediaType={mediaType}
                        media={media}
                        reviews={media.reviews.filter(
                            (item) => item.user != null
                        )}
                    />
                </div>

                {/* Media recommendations */}
                <div className='pb-[75px]'>
                    {media.recommend.length > 0 && (
                        <MediaSlider
                            heading='You May Also Like'
                            mediaType={mediaType}
                            mediaData={media.recommend}
                        />
                    )}
                    {media.recommend.length === 0 && (
                        <MediaSlider
                            heading='You May Also Like'
                            mediaType={mediaType}
                            mediaCategory='top_rated'
                        />
                    )}
                </div>
            </main>
        </div>
    )
}

export default MediaDetailPage
