import mongoose from 'mongoose'

const options = {
	file: {
		type: String,
		required: true,
	},
	ext: String,
	dateCreated: {
		type: Date,
		default: new Date()
	}
}

const model = new mongoose.model('File', mongoose.Schema(options))
let days = parseInt(30 *24*60*60*1000, 10)
model.deleteMany({ dateCreated: { $lt: new Date(Date.now() - days) }})

export default model
