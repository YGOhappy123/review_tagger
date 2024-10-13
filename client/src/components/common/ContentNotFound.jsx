import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

const ContentNotFound = ({ text, navigatePath = '/', btnText, btnIcon, bigText = '' }) => {
    const navigate = useNavigate()

    return (
        <div className='-mt-[72px] flex h-screen flex-col items-center justify-center gap-8 px-4'>
            {bigText && (
                <h1 className='bg-gradient-main bg-clip-text text-9xl font-semibold tracking-wider text-transparent'>
                    {bigText}
                </h1>
            )}

            <h2 className='px-5 text-center text-xl font-semibold text-white'>{text}</h2>
            <button
                className='flex items-center gap-3 rounded bg-gradient-main px-7 py-3 text-lg font-medium uppercase text-white hover:opacity-90 lg:px-8'
                onClick={() => navigate(navigatePath)}
            >
                <FontAwesomeIcon icon={btnIcon ?? faHome} />
                <span>{btnText ?? 'Back To Home'}</span>
            </button>
        </div>
    )
}
export default ContentNotFound
