import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { axiosPublicIns } from '../../libs/axios'
import getToastOptions from '../../configs/toastConfig'
import MediaItem from './MediaItem'

const MEDIAS_PER_PAGE = 10

const PersonMediaGrid = ({ heading, personId }) => {
    const [medias, setMedias] = useState([])
    const [filteredMedias, setFilteredMedias] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const getMedias = async () => {
            try {
                const { data } = await axiosPublicIns.get(
                    `/person/${personId}/medias`
                )

                const sortedMedias = data.data.cast.sort(
                    (a, b) => getReleaseDate(b) - getReleaseDate(a)
                )

                setMedias(sortedMedias)
                setFilteredMedias([...sortedMedias].splice(0, MEDIAS_PER_PAGE))
            } catch (err) {
                return toast.error(
                    'Oops! There was an error loading media',
                    getToastOptions()
                )
            }
        }
        getMedias()
    }, [personId])

    const handleLoadMore = () => {
        setFilteredMedias([
            ...filteredMedias,
            ...[...medias].splice(
                currentPage * MEDIAS_PER_PAGE,
                MEDIAS_PER_PAGE
            )
        ])
        setCurrentPage((prev) => prev + 1)
    }

    const getReleaseDate = (media) => {
        const date =
            media.media_type === 'movie'
                ? new Date(media.release_date)
                : new Date(media.first_air_date)
        return date.getTime()
    }

    return (
        <div className='flex flex-col'>
            <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                {heading}
            </h2>

            <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {filteredMedias.map((item, index) => (
                    <div key={index}>
                        <MediaItem media={item} mediaType={item.media_type} />
                    </div>
                ))}
            </div>

            {filteredMedias.length < medias.length && (
                <button
                    className='mt-10 self-center rounded-full bg-gradient-main px-40 py-4 font-medium uppercase tracking-wider text-white hover:opacity-90'
                    onClick={handleLoadMore}
                >
                    <FontAwesomeIcon icon={faPhotoFilm} />
                    <span className='ml-3'>Load More</span>
                </button>
            )}
        </div>
    )
}

export default PersonMediaGrid
