const AllowedOrigins = [
    'https://just-chat.vercel.app',
    'http://localhost:3000'
]

export const corsOptions = {
    origin: (origin, callback) => {
        if (AllowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}