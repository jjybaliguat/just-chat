import jwt from 'jsonwebtoken'

export const verifyJWT = (req, res, next) => {
    const token_secret = process.env.TOKEN_SECRET
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        token_secret,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.User.id
            next()
        }
    )
}