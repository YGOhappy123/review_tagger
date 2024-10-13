import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { toast } from 'react-toastify'
import { setIsGlobalLoading } from '../../redux/slices/appSlice'
import { axiosPublicIns } from '../../libs/axios'
import getToastOptions from '../../configs/toastConfig'
import MediaItem from './MediaItem'

const MediaSlider = ({
    heading,
    mediaType,
    mediaCategory,
    mediaData,
    itemGap = 20
}) => {
    const dispatch = useDispatch()
    const [medias, setMedias] = useState(mediaData || [])

    useEffect(() => {
        const getMedias = async () => {
            dispatch(setIsGlobalLoading(true))
            try {
                const { data } = await axiosPublicIns.get(
                    `${mediaType}/${mediaCategory}?page=1`
                )

                setMedias(data.data.results)
            } catch (err) {
                return toast.error(
                    'Oops! There was an error loading movies and TV series',
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        if (!mediaData) getMedias()
    }, [mediaType, mediaCategory])

    const [slidesPerView, setSlidesPerView] = useState(2)
    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth
            const breakpoints = {
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280
            }

            if (windowWidth >= breakpoints.xl) {
                setSlidesPerView(5)
            } else if (windowWidth >= breakpoints.lg) {
                setSlidesPerView(4)
            } else if (windowWidth >= breakpoints.md) {
                setSlidesPerView(3)
            } else if (windowWidth >= breakpoints.sm) {
                setSlidesPerView(2)
            }
        }
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className='pb-[75px] last:pb-0'>
            <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                {heading}
            </h2>

            <Swiper
                spaceBetween={itemGap}
                slidesPerView={slidesPerView}
                grabCursor={true}
                style={{ width: '100%', height: 'max-content' }}
            >
                {medias.map((media, index) => (
                    <SwiperSlide key={index}>
                        <MediaItem media={media} mediaType={mediaType} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default MediaSlider
