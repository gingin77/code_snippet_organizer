const mongoose = require('mongoose')

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
  tags: {
    type: [String]
  },
  user: {
    type: [String]
  }
})

const Snippet = mongoose.model('Snippet', snippetSchema)
module.exports = Snippet
