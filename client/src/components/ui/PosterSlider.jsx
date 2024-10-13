import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import tmdbConfig from '../../configs/tmdbConfig'

const PosterSlider = ({ heading, posters }) => {
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
        <div>
            <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                {heading}
            </h2>

            <Swiper
                slidesPerView={slidesPerView}
                spaceBetween={20}
                grabCursor={true}
                loop={true}
                modules={[Autoplay]}
                style={{ width: '100%', height: 'max-content' }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}
                speed={300}
            >
                {posters.map((poster, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className='rounded-[10px] bg-cover bg-top pt-[150%]'
                            style={{
                                backgroundImage: `url(${tmdbConfig.posterPath(
                                    poster.file_path
                                )})`
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
export default PosterSlider
