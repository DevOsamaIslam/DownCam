import path from 'path'
import cookieParser from 'cookie-parser'
import layout from 'express-ejs-layouts'
import {
	dirname
} from 'path'
import {
	fileURLToPath
} from 'url'
import favicon from 'serve-favicon'
import sassMiddleware from 'node-sass-middleware'
import morgan from 'morgan'
import rfs from 'rotating-file-stream'

const __dirname = dirname(fileURLToPath(
	import.meta.url))

export default (express, app) => {
	// view engine setup
	app.set('views', path.join(__dirname, './views/pages'))
	app.use(layout)
	app.set('layout', '../layout')
	app.set('view engine', 'ejs')
	// favicon
	app.use(favicon(path.join(__dirname, 'public', 'images', 'assets', 'favicon.ico')))
	// parse req.body as json
	app.use(express.json())
	app.use(express.urlencoded({
		extended: false
	}))
	app.use(cookieParser())
	// sass middleware
	app.use(sassMiddleware({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		debug: false,
		outputStyle: 'compressed'
	}), express.static(path.join(__dirname, 'public')))

	// use the public file as the root for the static files
	app.use(express.static(path.join(__dirname, 'public')))

	// setup the logger
	// create a rotating write stream
	let accessLogStream = rfs.createStream('access.log', {
		interval: '1d', // rotate daily
		path: path.join(__dirname, 'bin', 'log')
	})
	app.use(morgan('combined', {
		stream: accessLogStream
	}))


	// send static variables with every request
	app.use((req, res, next) => {
		res.locals.appName = 'DownCam'
		next()
	})
}