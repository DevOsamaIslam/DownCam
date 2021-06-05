import mongoose from 'mongoose'

export const databaseConnect = () => {
	mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})
		.then(() => console.log('connected to DB'))
		.catch(err => console.error(err))
}