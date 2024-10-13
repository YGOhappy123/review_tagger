import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { axiosPublicIns } from '../libs/axios'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import { formatDateString } from '../utils/formatDateString'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import tmdbConfig from '../configs/tmdbConfig'
import getToastOptions from '../configs/toastConfig'
import ReadMoreParagraph from '../components/common/ReadMoreParagraph'
import PersonMediaGrid from '../components/ui/PersonMediaGrid'
import ContentNotFound from '../components/common/ContentNotFound'

const PersonDetailPage = () => {
    const { personId } = useParams()
    const isGlobalLoading = useSelector((state) => state.app.isGlobalLoading)
    const dispatch = useDispatch()

    useTitle('FlqCine | Person Detail')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [personId])

    const [person, setPerson] = useState(null)

    useEffect(() => {
        const getPersonData = async () => {
            try {
                dispatch(setIsGlobalLoading(true))
                const { data } = await axiosPublicIns.get(`/person/${personId}`)

                setPerson(data.data)
            } catch (err) {
                return toast.error(
                    `Oops! There was an error loading person data`,
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        getPersonData()
    }, [personId])

    if (!person) {
        if (isGlobalLoading) return null
        return (
            <ContentNotFound
                text={
                    "Sorry, we don't have information about the person you are looking for!"
                }
            />
        )
    }

    return (
        <div>
            <main className='mx-auto max-w-[1366px] px-4 py-[75px]'>
                {/* Person info */}
                <div className='flex flex-col pb-[75px] lg:flex-row'>
                    <div className='mx-auto mb-8 w-[70%] sm:w-1/2 md:w-[40%] lg:ml-0 lg:mr-8 lg:w-[25%]'>
                        <div
                            className='rounded bg-imgAlt bg-cover bg-center pt-[150%]'
                            style={{
                                backgroundImage: `url(${tmdbConfig.posterPath(
                                    person.profile_path
                                )})`
                            }}
                        ></div>
                    </div>

                    <div className='flex h-full w-full flex-col justify-center text-white lg:w-2/3'>
                        <h4 className='mb-5 text-3xl font-medium md:text-5xl md:leading-[1.3] lg:text-6xl lg:leading-[1.3]'>
                            {person.name}
                        </h4>
                        {person?.also_known_as?.length > 0 && (
                            <h5 className='-mt-5 mb-3 text-lg font-medium leading-8'>
                                Also known as: {person.also_known_as.join(', ')}
                            </h5>
                        )}
                        <span className='mb-3 font-medium uppercase text-secondary'>
                            {formatDateString(person.birthday)}
                            {person.deathday &&
                                ` - ${formatDateString(person.deathday)}`}
                        </span>
                        <p className='mb-3 font-medium'>
                            Known for department: {person.known_for_department}
                        </p>
                        <p className='mb-3 font-medium'>Biography:</p>
                        <ReadMoreParagraph
                            text={person.biography}
                            maxLength={500}
                        />
                    </div>
                </div>

                {/* Person medias */}
                <PersonMediaGrid heading='Medias' personId={personId} />
            </main>
        </div>
    )
}

export default PersonDetailPage
