import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { setIsGlobalLoading } from '../../redux/slices/appSlice'
import { axiosPublicIns } from '../../libs/axios'
import getToastOptions from '../../configs/toastConfig'
import tmdbConfig from '../../configs/tmdbConfig'
import CircularProgress from '../common/CircularProgress'

const HeroSlider = ({ mediaType, mediaCategory }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])

    useEffect(() => {
        const getMovies = async () => {
            try {
                const { data } = await axiosPublicIns.get(
                    `${mediaType}/${mediaCategory}?page=1`
                )

                setMovies(data.data.results)
            } catch (err) {
                return toast.error(
                    `Oops! There was an error loading ${mediaCategory} movies`,
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }

        const getGenres = async () => {
            try {
                dispatch(setIsGlobalLoading(true))
                const { data } = await axiosPublicIns.get(`${mediaType}/genres`)

                setGenres(data.data.genres)
                getMovies()
            } catch (err) {
                dispatch(setIsGlobalLoading(false))
                return toast.error(
                    'Oops! There was an error loading genres',
                    getToastOptions()
                )
            }
        }

        getGenres()
    }, [mediaType, mediaCategory])

    const getGenresString = useCallback(
        (ids, separator = ',') => {
            return ids
                .map((id) => {
                    const matchingGenre = genres.find((item) => item.id === id)
                    return matchingGenre?.name
                })
                .filter((item) => Boolean(item))
                .join(`${separator} `)
        },
        [genres]
    )

    return (
        <div className='relative after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:z-[2] after:h-[30%] after:w-full after:bg-gradient-dark-to-t after:content-[""]'>
            <Swiper
                grabCursor={true}
                loop={true}
                modules={[Autoplay]}
                style={{ width: '100%', height: 'max-content' }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
                speed={1000}
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className='bg-cover bg-top pt-[130%] sm:pt-[80%] md:pt-[60%] lg:pt-[55%] xl:pt-[45%]'
                            style={{
                                backgroundImage: `url(${tmdbConfig.backdropPath(
                                    movie.backdrop_path || movie.poster_path
                                )})`
                            }}
                        ></div>

                        <div className='pointer-events-none absolute inset-0 bg-gradient-dark-to-r'></div>

                        <div className='absolute inset-0 px-5 md:px-10 lg:px-[100px] xl:px-40'>
                            <div className='flex h-full w-full flex-col justify-center text-white lg:w-2/3'>
                                <span className='font-medium uppercase text-secondary'>
                                    {getGenresString(movie.genre_ids)}
                                </span>
                                <h4 className='mb-5 line-clamp-2 text-ellipsis break-words text-3xl font-medium md:text-5xl md:leading-[1.3] lg:text-5xl lg:leading-[1.3] xl:text-6xl'>
                                    {movie.title || movie.name}
                                </h4>
                                {movie.overview && (
                                    <p className='mb-5 line-clamp-3 text-ellipsis break-words'>
                                        {movie.overview}
                                    </p>
                                )}
                                <div className='flex items-center gap-5'>
                                    <CircularProgress
                                        size={60}
                                        value={movie.vote_average}
                                    />
                                    <button
                                        className='rounded-full bg-gradient-main px-6 py-[10px] text-[14px] font-medium uppercase tracking-wider text-white hover:opacity-90'
                                        onClick={() =>
                                            navigate(
                                                `/${mediaType}/${movie.id}`
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlay} />
                                        <span className='ml-3'>
                                            Watch Trailer
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HeroSlider
