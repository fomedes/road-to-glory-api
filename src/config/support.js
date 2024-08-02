require('dotenv').config()
import './mongo'

import { Handlers, Integrations, init } from '@sentry/node'
import { Integrations as _Integrations } from '@sentry/tracing'
import cors from 'cors'
import express, { json } from 'express'
import Note, { findById as _findById, find, findByIdAndDelete, findByIdAndUpdate } from './models/Note'
import { findById } from './models/User'
const app = express()

import handleErrors from './middleware/handleErrors.js'
import notFound from './middleware/notFound.js'
import userExtractor from './middleware/userExtractor'

import loginRouter from './controllers/login'
import usersRouter from './controllers/users'

app.use(cors())
app.use(json())

init({
  dsn: 'https://ac034ebd99274911a8234148642e044c@o537348.ingest.sentry.io/5655435',
  integrations: [
    // enable HTTP calls tracing
    new Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new _Integrations.Express({ app })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})

{// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Handlers.tracingHandler())

app.get('/', (request, response) => {
  console.log(request.ip)
  console.log(request.ips)
  console.log(request.originalUrl)
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', async (request, response) => {
  const notes = await find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  _findById(id)
    .then(note => {
      if (note) return response.json(note)
      response.status(404).end()
    })
    .catch(err => next(err))
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(next)
})

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  // const note = await Note.findById(id)
  // if (!note) return response.sendStatus(404)

  const res = await findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)

  response.status(204).end()
})

app.post('/api/notes', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  // sacar userId de request
  const { userId } = request

  const user = await findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  // newNote.save().then(savedNote => {
  //   response.json(savedNote)
  // }).catch(err => next(err))

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})
}
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)

app.use(Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default { app, server }