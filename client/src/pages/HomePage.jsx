import { useEffect } from 'react'
import useTitle from '../hooks/useTitle'
import HeroSlider from '../components/ui/HeroSlider'
import MediaSlider from '../components/ui/MediaSlider'

const HomePage = () => {
    useTitle('FlqCine | Home')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='-mt-[72px]'>
            <HeroSlider mediaType='movie' mediaCategory='popular' />

            <main className='mx-auto max-w-[1366px] bg-white px-4 py-[75px]'>
                <MediaSlider
                    heading='popular movies'
                    mediaType='movie'
                    mediaCategory='popular'
                />
                <MediaSlider
                    heading='popular series'
                    mediaType='tv'
                    mediaCategory='popular'
                />
                <MediaSlider
                    heading='top rated movies'
                    mediaType='movie'
                    mediaCategory='top_rated'
                />
                <MediaSlider
                    heading='top rated series'
                    mediaType='tv'
                    mediaCategory='top_rated'
                />
            </main>
        </div>
    )
}

export default HomePage
