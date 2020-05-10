const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    user: String,
    id: String,
    name: String,
    details: String,
    start: String,
    end: String,
    color: String
});

const Calendar = mongoose.model('calendars', CalendarSchema);
module.exports = Calendar;