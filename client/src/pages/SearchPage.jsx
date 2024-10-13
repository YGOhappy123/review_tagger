import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm, faRotate } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { axiosPublicIns } from '../libs/axios'
import getToastOptions from '../configs/toastConfig'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import useDebounce from '../hooks/useDebounce'
import MediaGrid from '../components/ui/MediaGrid'

const MEDIA_TYPES_BTN = [
    { label: 'Movies', value: 'movie' },
    { label: 'TV Series', value: 'tv' },
    { label: 'People', value: 'people' }
]

const SearchPage = () => {
    useTitle('FlqCine | Search')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [query, setQuery] = useState('')
    const [mediaType, setMediaType] = useState('movie')
    const [medias, setMedias] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const debouncedQuery = useDebounce(query)
    const handleLoadMore = () => setCurrentPage((prev) => prev + 1)

    const searchMedia = async () => {
        if (isLoading) return

        try {
            setIsLoading(true)
            const { data } = await axiosPublicIns.get(
                `/${mediaType}/search?query=${query}&page=${currentPage}`
            )

            setMedias(data.data.results)
        } catch (err) {
            return toast.error(
                `Oops! There was an error searching for '${query}'`,
                getToastOptions()
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (query.trim() === '') {
            setMedias([])
            setCurrentPage(1)
        } else searchMedia()
    }, [debouncedQuery, mediaType, currentPage])

    return (
        <div>
            <main className='mx-auto flex max-w-[1366px] flex-col px-4 py-[75px]'>
                <div className='mb-10 flex items-center justify-center gap-10'>
                    {MEDIA_TYPES_BTN.map((item) => (
                        <div
                            key={item.value}
                            className='flex items-center gap-2'
                        >
                            <input
                                type='radio'
                                className="relative h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-500 outline-none after:absolute after:left-1/2 after:top-1/2 after:h-[0.625rem] after:w-[0.625rem] after:rounded-full after:content-[''] after:[transform:translate(-50%,-50%)] checked:border-primary checked:after:bg-primary hover:cursor-pointer"
                                value={item.value}
                                checked={mediaType === item.value}
                                onChange={(e) => setMediaType(e.target.value)}
                                id={item.value}
                            />
                            <label
                                htmlFor={item.value}
                                className='inline-block pl-[0.15rem] text-lg font-medium uppercase text-white hover:cursor-pointer'
                            >
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>

                <div className='relative mb-10'>
                    <input
                        type='text'
                        className='peer block min-h-[auto] w-full rounded border-2 border-neutral-500 bg-transparent px-3 py-2 font-medium leading-[2.15] text-white caret-primary outline-none transition-all duration-200 ease-linear focus:border-primary motion-reduce:transition-none'
                        id='query'
                        placeholder=' '
                        spellCheck={false}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <label
                        htmlFor='query'
                        className='pointer-events-none absolute left-3 top-1/2 mb-0 max-w-[90%] origin-[0_0] -translate-y-1/2 truncate bg-black px-1 font-medium text-neutral-500 transition-all duration-200 ease-out peer-focus:top-0.5 peer-focus:scale-[0.8] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:text-primary motion-reduce:transition-none'
                    >
                        Enter something!
                    </label>
                </div>

                <MediaGrid medias={medias} mediaType={mediaType} />

                {medias.length > 0 && (
                    <button
                        className='mt-10 self-center rounded-full bg-gradient-main px-40 py-4 font-medium uppercase tracking-wider text-white hover:opacity-90'
                        onClick={handleLoadMore}
                    >
                        {isLoading ? (
                            <FontAwesomeIcon
                                icon={faRotate}
                                size='xl'
                                className='animate-spin'
                            />
                        ) : (
                            <FontAwesomeIcon icon={faPhotoFilm} size='xl' />
                        )}
                        <span className='ml-5'>Load More</span>
                    </button>
                )}
            </main>
        </div>
    )
}

export default SearchPage
