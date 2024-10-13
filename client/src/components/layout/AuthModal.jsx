import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { setIsAuthModalOpen } from '../../redux/slices/appSlice'
import { toast } from 'react-toastify'
import { isEmpty, isCorrectLength, isMatching } from '../../utils/formValidator'
import userService from '../../services/userService'
import getToastOptions from '../../configs/toastConfig'
import Logo from '../common/Logo'
import TextInput from '../common/TextInput'
import PasswordInput from '../common/PasswordInput'

const AuthModal = () => {
    const dispatch = useDispatch()
    const isAuthModalOpen = useSelector((state) => state.app.isAuthModalOpen)
    const [formType, setFormType] = useState('login')

    useEffect(() => setFormType('login'), [isAuthModalOpen])

    if (!isAuthModalOpen) return null

    return (
        <div
            className='fixed left-0 top-0 z-[200] h-screen w-screen bg-modalOverlay'
            onClick={() => dispatch(setIsAuthModalOpen(false))}
        >
            <div
                className='absolute left-1/2 top-1/2 w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-black p-8'
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className='absolute right-4 top-4 cursor-pointer text-secondary hover:scale-90'
                    onClick={() => dispatch(setIsAuthModalOpen(false))}
                >
                    <FontAwesomeIcon icon={faTimes} size='2x' />
                </div>

                <div className='mb-6 flex justify-center'>
                    <Logo />
                </div>

                {formType === 'login' && (
                    <LoginForm changeFormType={setFormType} />
                )}
                {formType === 'register' && (
                    <RegisterForm changeFormType={setFormType} />
                )}
            </div>
        </div>
    )
}

const LoginForm = ({ changeFormType }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = userService()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (isEmpty(username) || isEmpty(password)) {
            return toast.error('All fields are required', getToastOptions())
        }

        if (!isCorrectLength(password, 6, 20)) {
            return toast.error(
                'Password must be between 6 and 20 characters',
                getToastOptions()
            )
        }

        login({ username, password })
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                value={username}
                setValue={setUsername}
                placeholder='Username'
                fieldName='username'
            />
            <div className='-mt-4'>
                <PasswordInput
                    value={password}
                    setValue={setPassword}
                    placeholder='Password'
                    fieldName='password'
                />
            </div>
            <div className='flex flex-col items-center'>
                <button
                    type='submit'
                    className='w-full rounded bg-gradient-main py-3 font-semibold uppercase text-white hover:opacity-90 '
                >
                    Login
                </button>
                <div className='mt-6'>
                    <span className='font-medium text-white'>
                        Don't have an account?{' '}
                    </span>
                    <span
                        className='cursor-pointer font-bold text-primary'
                        onClick={() => changeFormType('register')}
                    >
                        Register
                    </span>
                </div>
            </div>
        </form>
    )
}

const RegisterForm = ({ changeFormType }) => {
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const { register } = userService()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (isEmpty(username) || isEmpty(password) || isEmpty(fullName)) {
            return toast.error('All fields are required', getToastOptions())
        }

        if (!isCorrectLength(password, 6, 20)) {
            return toast.error(
                'Password must be between 6 and 20 characters',
                getToastOptions()
            )
        }

        if (!isMatching(password, confirmPw)) {
            return toast.error('Passwords do not match', getToastOptions())
        }

        register({ username, password, fullName })
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                value={fullName}
                setValue={setFullName}
                placeholder='Full Name'
                fieldName='fullName'
            />
            <div className='-mt-4'>
                <TextInput
                    value={username}
                    setValue={setUsername}
                    placeholder='Username'
                    fieldName='username'
                />
            </div>

            <div className='-mt-4 flex gap-6'>
                <PasswordInput
                    value={password}
                    setValue={setPassword}
                    placeholder='Password'
                    fieldName='password'
                />
                <PasswordInput
                    value={confirmPw}
                    setValue={setConfirmPw}
                    placeholder='Confirm Password'
                    fieldName='confirmPw'
                />
            </div>

            <div className='flex flex-col items-center'>
                <button
                    type='submit'
                    className='w-full rounded bg-gradient-main py-3 font-semibold uppercase text-white hover:opacity-90 '
                >
                    Register
                </button>
                <div className='mt-6'>
                    <span className='font-medium text-white'>
                        Already have an account?{' '}
                    </span>
                    <span
                        className='cursor-pointer font-bold text-primary'
                        onClick={() => changeFormType('login')}
                    >
                        Login
                    </span>
                </div>
            </div>
        </form>
    )
}

export default AuthModal
