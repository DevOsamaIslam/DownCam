import mongoose from 'mongoose'

const options = {
	text: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		default: new Date()
	}
}

const model = mongoose.model('Text', new mongoose.Schema(options))

export default model
