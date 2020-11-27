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

const model = new mongoose.model('Text', mongoose.Schema(options))
let days = parseInt(30 *24*60*60*1000, 10)
model.deleteMany({ dateCreated: { $lt: new Date(Date.now() - days) }})

export default model
