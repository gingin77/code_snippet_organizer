const mongoose = require('mongoose')

// var ToySchema = new Schema({ name: String });
// var ToyBox = new Schema({
//     toys: [ToySchema]
//   , buffers: [Buffer]
//   , string:  [String]
//   , numbers: [Number]
//   ... etc
// });

// const tagSchema = new mongoose.Schema({
//     type: String
// })

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++']
  },
  body: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  tags:
    [String],
  user: {
    type: String
  }
})

const Snippet = mongoose.model('Snippet', snippetSchema)
module.exports = Snippet
