import mongoose from 'mongoose'

const options = {
	lang: String,
	language: String,
	contents: {}
}
const model = mongoose.model('Language', new mongoose.Schema(options))

export default model