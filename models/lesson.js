const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kabanSchema = new Schema ({
    name: String
})
const LessonSchema = new Schema({
    email: String,
    Projects: Object
});

const Lesson = mongoose.model('lessons', LessonSchema);
module.exports = Lesson;