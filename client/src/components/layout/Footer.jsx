import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEnvelope,
    faLocationDot,
    faPhoneVolume
} from '@fortawesome/free-solid-svg-icons'
import Logo from '../common/Logo'

const Footer = () => {
    return (
        <footer className='bg-black px-5 py-8 lg:px-6'>
            <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-between'>
                <Logo />

                <p className='hidden max-w-[500px] px-10 text-center leading-7 text-white lg:block 2xl:max-w-[600px]'>
                    Discover and explore movies, TV shows, and more with our
                    TMDB-powered app. Enjoy an intuitive interface, personalized
                    recommendations, and a visually engaging experience. Start
                    your entertainment journey today!
                </p>

                <div className='text-center'>
                    <h2 className='mb-4 hidden text-2xl font-semibold uppercase text-primary sm:block'>
                        Contact Us
                    </h2>
                    <ul className='flex cursor-pointer list-none flex-col gap-2 font-medium text-white lg:gap-3'>
                        <li>
                            <a
                                href='tel:0913283742'
                                className='flex items-center justify-center gap-2 hover:text-secondary'
                            >
                                <FontAwesomeIcon icon={faPhoneVolume} />
                                (+84)913.283.742
                            </a>
                        </li>
                        <li>
                            <a
                                href='mailto:hagiahuy21052003@gmail.com'
                                className='flex items-center justify-center gap-2 hover:text-secondary'
                            >
                                <FontAwesomeIcon icon={faEnvelope} />
                                hagiahuy21052003@gmail.com
                            </a>
                        </li>
                        <li className='flex items-center justify-center gap-2 hover:text-secondary'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            Ho Chi Minh city, Vietnam
                        </li>
                    </ul>
                </div>
            </div>
            <hr className='my-6 border-[1.5px] border-gray-700 lg:my-8' />
            <p className='text-center font-medium text-white'>
                &copy; 2023 FlqCine. All Rights Reserved.
            </p>
        </footer>
    )
}

export default Footer
