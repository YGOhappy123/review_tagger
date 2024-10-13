import { useNavigate } from 'react-router-dom'

const Logo = () => {
    const navigate = useNavigate()

    return (
        <div
            className='flex cursor-pointer items-center gap-2 font-poppins lg:gap-3'
            onClick={() => navigate('/')}
        >
            <span className='bg-gradient-main bg-clip-text text-7xl font-bold text-transparent'>
                F
            </span>
            <span className='text-lg font-semibold uppercase tracking-[0.3em] text-white lg:tracking-[0.4em]'>
                FlqCine
            </span>
        </div>
    )
}
export default Logo
