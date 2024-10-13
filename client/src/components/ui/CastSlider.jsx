import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import tmdbConfig from '../../configs/tmdbConfig'

const CastSlider = ({ heading, casts }) => {
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
            <h2 className='relative mb-5 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                {heading}
            </h2>

            <Swiper
                spaceBetween={10}
                slidesPerView={slidesPerView}
                grabCursor={true}
                style={{ width: '100%', height: 'max-content' }}
            >
                {casts.map((cast, index) => (
                    <SwiperSlide key={index}>
                        <Link to={`/person/${cast.id}`}>
                            <div
                                className='relative bg-imgAlt bg-cover bg-center pt-[120%]'
                                style={{
                                    backgroundImage: `url(${tmdbConfig.posterPath(
                                        cast.profile_path
                                    )})`
                                }}
                            >
                                <div className='absolute bottom-0 left-0 w-full bg-[rgba(0,0,0,0.6)] p-2 pb-1'>
                                    <p className='line-clamp-1 text-ellipsis break-all font-medium'>
                                        {cast.name}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default CastSlider
