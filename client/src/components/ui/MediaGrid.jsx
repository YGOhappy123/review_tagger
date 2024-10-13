import MediaItem from './MediaItem'

const MediaGrid = ({ medias, mediaType }) => {
    return (
        <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {medias.map((item, index) => (
                <div key={index}>
                    <MediaItem media={item} mediaType={mediaType} />
                </div>
            ))}
        </div>
    )
}

export default MediaGrid
