import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import tmdbConfig from '../../configs/tmdbConfig'

const VideoSlider = ({ heading, videos }) => {
    return (
        <div>
            <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                {heading}
            </h2>

            <div className='swiperJS-media-wrapper'>
                <Swiper
                    spaceBetween={10}
                    grabCursor={true}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Navigation, Pagination]}
                    style={{ width: '100%', height: 'max-content' }}
                >
                    {videos.map((video, index) => (
                        <SwiperSlide key={index}>
                            <MediaVideo video={video} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

const MediaVideo = ({ video }) => {
    const iframeRef = useRef()

    useEffect(() => {
        const height = (iframeRef.current.offsetWidth * 9) / 16 + 'px'
        iframeRef.current.setAttribute('height', height)
    }, [video])

    return (
        <div className='h-max'>
            <iframe
                key={video.key}
                src={tmdbConfig.youtubePath(video.key)}
                ref={iframeRef}
                width='100%'
                title={video.id}
                style={{ border: 0 }}
            />
        </div>
    )
}

export default VideoSlider
