const express = require('express')
var morgan = require('morgan')

morgan.token('body', (request, response) => JSON.stringify(request.body))

const app = express()
const cors = require('cors')

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 100);
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has infor for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const exist = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (exist) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        "id": generateId(),
        ...request.body
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})