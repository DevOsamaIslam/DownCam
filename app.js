import createError from 'http-errors'
import express from 'express'

import indexRouter from './routes/index.js'
import apiRouter from './routes/api/index.js'
import * as util from './config/util.js'

const app = express()
util.databaseConnect()

// middleware
import middleware from './middleware.js'
middleware(express, app)

app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404))
})

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

export default app
