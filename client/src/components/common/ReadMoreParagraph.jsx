import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'

const ReadMoreParagraph = ({ text, maxLength = 200, classes }) => {
    const [isReadMore, setIsReadMore] = useState(true)
    const toggleReadMore = () => {
        setIsReadMore((prev) => !prev)
    }

    return (
        <>
            <p className={`mb-5 text-justify text-white ${classes}`}>
                &#8220;{' '}
                {isReadMore && text.length > maxLength
                    ? `${text.slice(0, maxLength)}...`
                    : text}{' '}
                &#8221;
            </p>

            {text.length > maxLength && (
                <button
                    className='self-start rounded-full bg-gradient-main px-6 py-[10px] text-[14px] font-medium uppercase tracking-wider text-white hover:opacity-90'
                    onClick={toggleReadMore}
                >
                    <FontAwesomeIcon icon={faBookOpen} />
                    <span className='ml-3'>
                        {isReadMore ? 'Read more' : 'Show less'}
                    </span>
                </button>
            )}
        </>
    )
}
export default ReadMoreParagraph
