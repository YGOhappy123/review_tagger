import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const axiosPublicIns = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

const axiosPrivateIns = axios.create({
    baseURL: BASE_URL
})

axiosPrivateIns.interceptors.request.use(async (config) => {
    return {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access-token')}`
        }
    }
})

export { axiosPublicIns, axiosPrivateIns }
