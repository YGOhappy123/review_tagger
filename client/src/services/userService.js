import getToastOptions from '../configs/toastConfig'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { axiosPublicIns, axiosPrivateIns } from '../libs/axios'
import { setFavoritesList, setUser, signOut } from '../redux/slices/userSlice'
import { setIsAuthModalOpen } from '../redux/slices/appSlice'

const userService = () => {
    const dispatch = useDispatch()

    const register = async ({ username, password, fullName }) => {
        try {
            const response = await axiosPublicIns.post('/user/register', {
                username,
                password,
                fullName
            })

            dispatch(setUser(response.data))
            dispatch(setIsAuthModalOpen(false))
            return toast.success(response.data.message, getToastOptions())
        } catch (err) {
            return toast.error(err?.response?.data?.message, getToastOptions())
        }
    }

    const login = async ({ username, password }) => {
        try {
            const response = await axiosPublicIns.post('/user/login', {
                username,
                password
            })

            dispatch(setUser(response.data))
            dispatch(setIsAuthModalOpen(false))
            return toast.success(response.data.message, getToastOptions())
        } catch (err) {
            return toast.error(err?.response?.data?.message, getToastOptions())
        }
    }

    const getInfo = async () => {
        try {
            const response = await axiosPrivateIns.get('/user/info')
            return dispatch(setUser(response?.data))
        } catch (err) {
            return dispatch(signOut())
        }
    }

    const fetchFavoritesList = async () => {
        try {
            const response = await axiosPrivateIns.get(`/user/favorites`)

            dispatch(setFavoritesList(response?.data?.data ?? []))
        } catch (err) {
            return toast.error(err?.response?.data?.message, getToastOptions())
        }
    }

    return { register, login, getInfo, fetchFavoritesList }
}

export default userService
