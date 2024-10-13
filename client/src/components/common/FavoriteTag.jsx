import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const FavoriteTag = ({ icon, size = 'xl' }) => {
    return (
        <div className='absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white text-primary'>
            <FontAwesomeIcon
                icon={icon ?? faHeart}
                size={size}
                style={{ marginTop: 1 }}
            />
        </div>
    )
}

export default FavoriteTag
