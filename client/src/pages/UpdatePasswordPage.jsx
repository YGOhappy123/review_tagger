import { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faPenNib } from '@fortawesome/free-solid-svg-icons'
import { axiosPrivateIns } from '../libs/axios'
import { isEmpty, isCorrectLength, isMatching } from '../utils/formValidator'
import getToastOptions from '../configs/toastConfig'
import PasswordInput from '../components/common/PasswordInput'

const UpdatePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLoading) return

        if (isEmpty(currentPassword) || isEmpty(newPassword)) {
            return toast.error('All fields are required', getToastOptions())
        }

        if (!isCorrectLength(newPassword, 6, 20)) {
            return toast.error(
                'Password must be between 6 and 20 characters',
                getToastOptions()
            )
        }

        if (!isMatching(newPassword, confirmPassword)) {
            return toast.error('Passwords do not match', getToastOptions())
        }

        try {
            setIsLoading(true)

            const { data } = await axiosPrivateIns.post(
                '/user/change-password',
                {
                    password: currentPassword,
                    newPassword: newPassword
                }
            )

            toast.success(data.message, getToastOptions())
            resetForm()
        } catch (err) {
            return toast.error(err?.response?.data?.message, getToastOptions())
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    return (
        <div>
            <main className='mx-auto flex max-w-[1366px] flex-col px-4 py-[75px]'>
                <h2 className='relative mb-10 border-b border-[#d8d8d8] pb-5 text-lg font-semibold uppercase text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-1 after:w-[180px] after:bg-gradient-main after:content-[""]'>
                    Update Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <PasswordInput
                        value={currentPassword}
                        setValue={setCurrentPassword}
                        placeholder='Current Password'
                        fieldName='currPw'
                    />
                    <PasswordInput
                        value={newPassword}
                        setValue={setNewPassword}
                        placeholder='New Password'
                        fieldName='newPw'
                    />
                    <PasswordInput
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        placeholder='Confirm Password'
                        fieldName='confirmPw'
                    />

                    <button
                        type='submit'
                        className='rounded bg-gradient-main px-6 py-3 text-lg font-medium uppercase text-white hover:opacity-90 lg:px-8'
                    >
                        {isLoading ? (
                            <FontAwesomeIcon
                                icon={faRotate}
                                size='lg'
                                className='animate-spin'
                            />
                        ) : (
                            <FontAwesomeIcon icon={faPenNib} size='lg' />
                        )}
                        <span className='ml-3'>Update Password</span>
                    </button>
                </form>
            </main>
        </div>
    )
}

export default UpdatePasswordPage
