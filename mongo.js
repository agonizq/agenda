const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/agenda?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: 'Pepita de los palotes',
    number: '3434-4545',
})

/* note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
}) */

Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})