const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kabanSchema = new Schema ({
    name: String
})
const NoteSchema = new Schema({
    user: String,
    notes: Object
});

const Note = mongoose.model('notes', NoteSchema);
module.exports = Note;