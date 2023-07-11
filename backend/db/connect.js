import mongoose from 'mongoose'


const connnectDB = (url) => {
    return mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
}

export default connnectDB