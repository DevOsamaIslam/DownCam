import express from 'express'
const router = express.Router()
import Language from '../model/language.js'

let defaultLang = {
	lang: 'en',
	language: 'English',
	script: 'English',
	contents: {
		tabs: {
			url: {
				tabTitle: 'URL',
				placeholder: 'Type the URL'
			},
			text: {
				tabTitle: 'Text',
				placeholder: 'Paste your text here'
			},
			file: {
				tabTitle: 'File',
				placeholder: 'File size must be below 30 MB',
				addButton: 'File',
				progressText: 'done..'
			}
		},
		submitButton: 'Drop'
	}
}

/* GET home page. */
router.get('/', (req, res) => {
	let accepted = req.locale.language
	Language.findOne({
		lang: accepted
	}, (err, data) => {
		res.render('index', {
			language: data || defaultLang
		})
	})
})

export default router