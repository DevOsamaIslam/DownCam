import mongoose from 'mongoose'

const options = {
	file: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		default: new Date()
	}
}

const model = mongoose.model('File', new mongoose.Schema(options))

export default model
