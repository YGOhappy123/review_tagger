const jwt = require('jsonwebtoken')

const decodeToken = (req) => {
    try {
        const authHeader =
            req.headers.authorization || req.headers.Authorization

        if (!authHeader?.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return decoded.data
    } catch {
        return null
    }
}

const verifyJWT = (req, res, next) => {
    const decodedValue = decodeToken(req)

    if (!decodedValue) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    req.userId = decodedValue
    next()
}

module.exports = { decodeToken, verifyJWT }
