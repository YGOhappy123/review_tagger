const axios = require('axios')

const axiosIns = axios.create({
    headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'identity'
    }
})

module.exports = axiosIns
