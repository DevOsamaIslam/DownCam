import mongoose from 'mongoose'

export const databaseConnect = () => {
	mongoose.connect('mongodb+srv://adminuser:wxbSeRZT6N8aTCo4@cluster0.hrr6k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})
		.then(() => console.log('connected to DB'))
		.catch(err => console.error(err))
}