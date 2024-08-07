require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
var morgan = require('morgan')

morgan.token('body', (request, response) => JSON.stringify(request.body))

const app = express()
const cors = require('cors')

let personsCount = 0

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {

        let messages = {};
        for (let field in error.errors) {
            if (field === 'name') {
                messages[field] = 'Name must be at least 3 characters long.';
            } else if (field === 'number') {
                messages[field] = 'Number must be in the format XX-XXX or XXX-XXXX.';
            } else {
                messages[field] = error.errors[field].message;
            }
        }
        return response.status(400).json({ errors: messages })
    }

    next(error)
}

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        personsCount = result.length
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has infor for ${personsCount} people</p><p>${new Date()}</p>`)
})

app.get(`/api/persons/:id`, (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete(`/api/persons/:id`, (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

    const person = new Person({
        ...request.body
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))

})

app.put(`/api/persons/:id`, (request, response, next) => {
    const body = request.body

    const person = {
        ...request.body
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))

})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})