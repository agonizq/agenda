require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
var morgan = require('morgan')

morgan.token('body', (request, response) => JSON.stringify(request.body))

const app = express()
const cors = require('cors')

let persons = [
]

let personsCount = 0

const generateId = () => {
    return Math.floor(Math.random() * 100);
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

app.get(`/api/persons/:id`, (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    /* if (exist) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } */

    const person = new Person({
        ...request.body
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    //persons = persons.concat(person)

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})