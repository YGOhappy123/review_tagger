import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faRotate } from '@fortawesome/free-solid-svg-icons'

const AddToFavoriteBtn = ({ isFavorite, loading = false, onClick }) => {
    return (
        <button
            className='relative rounded-full bg-gradient-main px-6 py-[10px] text-[14px] font-medium uppercase tracking-wider text-white hover:opacity-90'
            onClick={onClick}
        >
            <span className='pl-7'>
                {isFavorite ? 'Remove from favorite' : 'Add to favorite'}
            </span>
            <div className='absolute left-0 top-0 aspect-square h-full p-0.5'>
                <div className='flex h-full items-center justify-center rounded-full bg-white text-primary'>
                    {loading ? (
                        <FontAwesomeIcon
                            icon={faRotate}
                            size='xl'
                            className='animate-spin'
                        />
                    ) : (
                        <FontAwesomeIcon icon={faHeart} size='xl' />
                    )}
                </div>
            </div>
        </button>
    )
}

export default AddToFavoriteBtn
