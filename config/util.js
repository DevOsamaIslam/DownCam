import mongoose from 'mongoose'

export const databaseConnect = () => {
  mongoose.connect('mongodb://127.0.0.1:27017/downcam', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
    .then(() => console.log('connected to DB'))
    .catch(err => console.error(err))
}

