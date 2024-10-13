const BackgroundPoster = ({ posterPath }) => {
    return (
        <div
            className='sm:pt[40%] relative -z-[1] bg-cover bg-fixed bg-top pt-[60%] after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-dark-to-t after:content-[""] md:pt-[35%]'
            style={{ backgroundImage: `url(${posterPath})` }}
        ></div>
    )
}

export default BackgroundPoster
