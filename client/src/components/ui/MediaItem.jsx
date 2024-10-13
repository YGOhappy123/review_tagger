import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCircleInfo, faHeart } from '@fortawesome/free-solid-svg-icons'
import { formatDateString } from '../../utils/formatDateString'
import tmdbConfig from '../../configs/tmdbConfig'

const MediaItem = ({ media, mediaType }) => {
    const favoritesList = useSelector((state) => state.user.favoritesList)

    const [title, setTitle] = useState('')
    const [posterPath, setPosterPath] = useState('')
    const [releaseDate, setReleaseDate] = useState(null)

    useEffect(() => {
        setTitle(media.title || media.name || media.mediaTitle)

        setPosterPath(
            tmdbConfig.posterPath(media.poster_path || media.backdrop_path || media.mediaPoster || media.profile_path)
        )

        if (mediaType === 'movie') {
            setReleaseDate(media.release_date)
        } else {
            setReleaseDate(media.first_air_date)
        }
    }, [media, mediaType])

    const checkFavoriteItem = useCallback(() => {
        const targetId = media.mediaId?.toString() || media.id?.toString()
        const isInFavoriteList = favoritesList.find((item) => item.mediaId === targetId)
        return isInFavoriteList
    }, [favoritesList])

    return (
        <Link to={mediaType === 'people' ? `/person/${media.id}` : `/${mediaType}/${media.mediaId || media.id}`}>
            <div className='relative cursor-pointer overflow-hidden rounded-[10px] border border-[#d8d8d8] before:absolute before:-left-[140px] before:bottom-0 before:h-[105%] before:w-0 before:skew-x-[30deg] before:bg-gradient-main before:opacity-90 before:duration-500 before:content-[""] hover:before:w-[230%] [&:hover>aside]:scale-100 [&:hover>aside]:opacity-100'>
                <div className="bg-imgAlt bg-cover pt-[150%]" style={{ backgroundImage: `url(${posterPath})` }}></div>

                {mediaType !== 'people' && checkFavoriteItem() && (
                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white text-primary">
                        <FontAwesomeIcon icon={faHeart} size="xl" style={{ marginTop: 1 }} />
                    </div>
                )}

                <aside className="absolute left-0 top-0 z-[1] flex h-full w-full scale-90 flex-col items-center justify-center p-5 text-center font-medium text-white opacity-0 delay-100 duration-300">
                    <button className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white duration-200 hover:scale-90 hover:opacity-90">
                        {mediaType === 'people' ? (
                            <FontAwesomeIcon icon={faCircleInfo} size="lg" />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} size="lg" />
                        )}
                    </button>
                    <span className="mb-2 text-lg">{title}</span>
                    {mediaType === 'people' ? (
                        <span className="text-sm">Department: {media.known_for_department}</span>
                    ) : (
                        <span className="text-sm">Released: {formatDateString(releaseDate)}</span>
                    )}
                </aside>
            </div>
        </Link>
    )
}

export default MediaItem
