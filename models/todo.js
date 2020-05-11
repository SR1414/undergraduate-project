const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    user: String,
    todo: Object
});

const ToDo = mongoose.model('todos', TodoSchema);
module.exports = ToDo;