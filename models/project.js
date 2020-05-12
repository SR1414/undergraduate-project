const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    email: String,
    Projects: Object
});

const Project = mongoose.model('projects', ProjectSchema);
module.exports = Project;