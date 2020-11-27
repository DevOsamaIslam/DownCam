import express from 'express'
const router = express.Router()
import E from 'http-errors'
import QR from 'qrcode'
import Text from '../../model/Text.js'
import File from '../../model/File.js'
import upload from 'express-fileupload'

router.post('/url/', (req, res, next) => {
	let url = req.body.url
	url = url.replace(/\s/g, '')
	if (!url) return next(E.NotAcceptable())
	QR.toDataURL(url, (err, data) => {
		if (err) return next(E.InternalServerError())
		res.json(data)
	})
})

router.post('/text', (req, res, next) => {
	let text = req.body.text
	if(!text || !text.trim()) return res.status(404)
	text = text.replace(/\n/g, '\\n')
	Text.create({
		text
	}, (err, data) => {
		if (err) return res.status(500)
		let url = `//localhost:3000/api/text/${data.id}`
		QR.toDataURL(url, (err, qrcode) => {
			if (err) return next(E.InternalServerError())
			res.json({
				qrcode,
				url
			})
		})
	})

})

router.get('/text/:id', (req, res, next) => {
	let id = req.params.id
	id = id.replace(/\s/g, '')
	if (!id) return next(E.NotAcceptable())
	Text.findByIdAndRemove(id, (err, data) => {
		let returned = ''
		if (err) return next(E.NotAcceptable())
		if (!data) returned = 'Text not found or expired :('
		else returned = data.text
		res.render('text', {
			data: returned
		})
	})
})

router.use(upload())
router.post('/upload', (req, res) => {
	let maxSize = 30 *1024*1024
	if(!req.files) return res.status(404)
	let file = req.files.file
	if(file.size > maxSize)
		return res.status(413)
	// check if file not uploaded
	if (!file) return res.status(404)

	// if file exists
	let ext = file.mimetype.split('/')[1]
	File.create({
		file: file.name,
		ext
	}, (err, data) => {
		// if something went wrong
		if (err) return res.status(500)

		// if database entry created
		if (data) {
			// move the uploaded file into that folder
			file.mv(`./public/uploads/${data.id}.${ext}`, (err) => {
				// if something went wrong while moving the file
				if (err) return res.status(500)
				// if file moved, generate a new QR code to the address of the file
				let url = `//localhost:3000/api/file/${data.id}`
				QR.toDataURL(url, (err, qrcode) => {
					// if something went wrong while generating the QR code
					if (err) return res.status(500)
					// if everything is fine, send the QR data
					res.json({
						qrcode,
						url
					})
				})
			})
		}
	})
})


router.get('/file/:id', (req, res, next) => {
	let id = req.params.id
	File.findByIdAndRemove(id, (err, data) => {
		// failed to remove
		if(err) return next(E.InternalServerError())

		// return the removed item
		res.download(`./public/uploads/${data.id}.${data.ext}`)
	})
})
export default router