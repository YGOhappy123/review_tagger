import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import tmdbConfig from '../../configs/tmdbConfig'

const BackdropSlider = ({ heading, backdrops }) => {
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
                    {backdrops.map((backdrop, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className='bg-cover bg-top pt-[60%]'
                                style={{
                                    backgroundImage: `url(${tmdbConfig.backdropPath(
                                        backdrop.file_path
                                    )})`
                                }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default BackdropSlider
