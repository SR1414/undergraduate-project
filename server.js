const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

//bring in models
let Project = require('./models/project');
let User = require('./models/user');
let Calendar = require('./models/calendar');
let Note = require('./models/note');
let ToDo = require('./models/todo');

mongoose.connect('mongodb://localhost/PlanIt', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// allow cross origin access 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
function genRandID(length) {
    var tmp = "";
    var availChars = "abcdefghijklmopqrstuvwxyz123456789";
    for (var i = 0; i < length; i++)
        tmp += availChars.charAt(Math.floor(Math.random() * availChars.length));
    return tmp;
}
app.post('/getcalendar', (req, res) => {
    console.log(req.body.email);
    Calendar.find({ user: req.body.email }, function (err, calendars) {
        //const calendarData = new Calendar(calendardata);
        ////calendarData.save()
        console.log(calendars)
        res.send(calendars);
    })
});
app.post('/addcalendar', (req, res) => {
    var newcalendar = {
        user: req.body.user,
        id: genRandID(12),
        name: req.body.name,
        details: req.body.details,
        start: req.body.start,
        end: req.body.end,
        color: req.body.color
    };
    var response = {
        message: ""
    };
    const calendarData = new Calendar(newcalendar);
    calendarData.save()
    response.message = "Appointment Saved";
    res.send(response);
});
app.post('/savetodo', (req, res) => {
    var response = {
        message: ""
    };
    console.log(req.body)
    var Email = req.body.user;
    var tododetails = req.body.todo;
    var LoggedTodo = {
        user: Email,
        todo: tododetails
    };
    console.log(req.body.user)
    ToDo.findOne({ user: req.body.user }, function (err, todos) {
        if (todos) {
            ToDo.updateOne({ user: req.body.user }, {
                $set: {
                    todo: tododetails
                }
            })
                .catch(function (error, affect, resp) {
                    console.log("updated");
                })
            response.message = "Todo Saved";
            res.send(response);
            return;
        }
        if (!todos == true) {
            const ToDoData = new ToDo(LoggedTodo);
            ToDoData.save();
            return;
        }


    })
});

app.post('/gettodo', (req, res) => {
    console.log(req.body.user)
    var response = {
        todo: [],
        message: ""
    };
    ToDo.findOne({ user: req.body.user }, function (err, todos) {
        if (todos) {
            response.message = "Got Notes";
            response.todo = todos.todo
            console.log(todos);
            res.send(response);
            if (err) return handleError(err);
            return;
        }
        if (!todos == true) {
            response.message = "No Notes";
            console.log("user has no notes");
            res.send(response)
            return;
        }

    });
});

app.post('/updatecalendar', (req, res) => {

    var response = {
        message: ""
    };
    Calendar.updateOne({ id: req.body.selectedcalendar }, { details: req.body.update }, function (err, calendars) {
        console.log("Updated Appointment")
        response.message = "Updated Appointment"
        //res.send(response);
    });

});

app.post('/deletecalendar', (req, res) => {
    console.log(req.body.ToDelete)
    var response = {
        message: ""
    };
    Calendar.deleteOne({ id: req.body.ToDelete }, function (err) {
        response.message = "Deleted Appointment";
        res.send(response);
        console.log("Deleted Appointment")
        if (err) return handleError(err);
    });
});
app.post('/getnotes', (req, res) => {
    console.log(req.body.user)
    var response = {
        notes: "",
        message: ""
    };
    Note.findOne({ user: req.body.user }, function (err, notes) {
        if (notes) {
            response.message = "Got Notes";
            response.notes = notes.notes
            console.log(notes);
            res.send(response);
            if (err) return handleError(err);
            return;
        }
        if (!notes) {
            response.message = "No Notes";
            console.log("user has no notes");
            res.send(response)
            return;
        }

    });
});
app.post('/savenote', (req, res) => {
    var response = {
        message: ""
    };
    console.log(req.body.user)
    var Email = req.body.user;
    var notedetails = req.body.notedetails;
    var LoggedNotes = {
        user: Email,
        notes: notedetails
    };
    console.log(req.body.user)
    Note.findOne({ user: req.body.user }, function (err, notes) {
        console.log(notes);
        if (notes) {
            Note.updateOne({ user: req.body.user }, {
                $set: {
                    notes: notedetails
                }
            })
                .catch(function (error, affect, resp) {
                    console.log("updated");
                })
            response.message = "Notes Saved";
            res.send(response);
            return;
        }
        if (!notes == true) {
            const noteData = new Note(LoggedNotes);
            noteData.save();
            return;
        }


    })
})
app.post('/saveproject', (req, res) => {
    var response = {
        message: ""
    };
    var Email = req.body.Email;
    var ProjectName = req.body.ProjectName;
    var ProjectContents = req.body.ProjectContents;
    var LoggedProject = {
        email: Email,
        Projects: [{
            ProjectName: ProjectName,
            ProjectContents: ProjectContents
        }]
    };
    Project.findOne({ email: req.body.Email }, function (err, projects) {
        if (!projects) {
            const projectData = new Project(LoggedProject);
            projectData.save();
            return;
        }
        var i;
        for (i = 0; i < projects.Projects.length; i++) {
            //console.log("hello")
            if (projects.Projects[i].ProjectName == req.body.ProjectName) {
                projects.Projects[i].ProjectContents = req.body.ProjectContents
                var updateProject = projects.Projects;
                //console.log(updateProject);
                Project.updateOne({ email: req.body.Email }, {
                    $set: {
                        Projects: updateProject
                    }
                })
                    .catch(function (error, affect, resp) {
                        console.log("updated");
                    })
                response.message = "Project Updated";
                res.send(response)
                console.log("overwriting Project")
                return;
            }
        }
        var test = projects;
        test.Projects.push(LoggedProject.Projects[0]);
        console.log(test);
        console.log(updateProject);
        Project.updateOne({ email: req.body.Email }, {
            $set: {
                Projects: test.Projects
            }
        })
            .catch(function (error, affect, resp) {
                console.log("updated");
            })
        response.message = "Project Saved";
        res.send(response);
        return;
    })
})

app.post('/loadproject', (req, res) => {
    var response = {
        message: "",
        project: ""
    }
    Project.findOne({ email: req.body.email }, function (err, projects) {
        if (!projects) {
            res.send(response)
            return;
        }
        var i;
        for (i = 0; i < projects.Projects.length; i++) {
            if (projects.Projects[i].ProjectName == req.body.projectname) {
                response.project = {
                    ProjectName: projects.Projects[i].ProjectName,
                    ProjectContents: projects.Projects[i].ProjectContents
                };
                response.message = "Project Loaded";
                res.send(response);
                return;
            }
        }
    })
})
app.post('/getprojectnames', (req, res) => {
    var response = {
        message: "",
        projectnames: new Array
    }
    Project.findOne({ email: req.body.email }, function (err, projects) {
        var i;
        if (!projects) {
            res.send(response);
            return;
        }
        for (i = 0; i < projects.Projects.length; i++) {
            //console.log(projects.Projects[i].ProjectName);
            response.projectnames.push(projects.Projects[i].ProjectName);

        }
        console.log(response.projectnames);
        res.send(response)


    })

})






app.get('/check', (req, res) => {
    console.log(req.body);
    var hello = {
        message: "hello",
        check: "it works"
    }
    res.send(hello);
})

app.get('/projects', (req, res) => {
    console.log("hello")
    Project.find({}, function (err, projects) {
        console.log(projects.length);
        console.log(projects.length !== 0);
        if (projects.length !== 0) {
            console.log("lessons exist")
            res.send(projects);
            return;
        }
        if (projects.length == 0) {
            console.log("lessons dont exist")
            for (i = 0; i <= courses.length - 1; i++) {
                const projectData = new Project(courses[i]);
                projectData.save();
                //Project.find({}, function (err, projects) {
                // res.send(projects); 
                //})
            }
        }
        res.send(projects);
        if (err) {
        }
    })


})
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
app.post('/testuser', function (req, res) {
    console.log(req.body.email);
})
app.post('/newuser', function (req, res) {
    console.log(req.body)
    var response = {
        email: "",
        title: "",
        message: "",
        AccountCreated: false
    }
    if (validateEmail(req.body.email)) {
        console.log("Valid email");
        if (req.body.password.length == 0) {
            console.log("Please enter a password");
            response.message = "Please enter a password";
            response.title = "Error";
            res.send(response);
            return;
        }
        if (req.body.password.length !== 0) {
            User.findOne({ email: req.body.email }, function (err, users) {
                if (!users) {
                    console.log("User does not exist");
                    const userData = new User(req.body);
                    userData.save();
                    console.log("Account Created");
                    response.message = "Email registered on new account";
                    response.title = "Account Created";
                    response.AccountCreated = true;
                    response.email = req.body.email;
                    console.log(response)
                    res.send(response);
                }
                if (users) {
                    console.log("User Already exists");
                    response.message = "Email Already Registered to another Account"
                    response.title = "Error";
                    response.email = req.body.email;
                    res.send(response);
                }
                if (err) {
                    res.send(response);
                    next();
                }
            })
            return;
        }
    }
    if (!validateEmail(req.body.email)) {
        console.log("Invalid email");
        response.message = "Invalid Email";
        response.title = "Error";
        res.send(response);
        return;
    }

});

app.post('/loguser', function (req, res) {
    var response = {
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        Projects: "",
        Validated: false
    }
    console.log(req.body);
    if (!validateEmail(req.body.email)) {
        console.log("Invalid Email");
        response.message = "Invalid Email";
        res.send(response);
        return;
    }
    if (validateEmail(req.body.email)) {
        console.log("Valid Email")
        if (req.body.password == 0) {
            response.message = "Please enter a password";
            console.log("Please enter a password");
            res.send(response);
            return;
        }
        if (req.body.password !== 0) {
            console.log("Valid Password")
            User.findOne({ email: req.body.email }, function (err, users) {
                if (!users) {
                    console.log("No Account registered to that email");
                    response.message = "No Account registered to that email";
                    res.send(response);
                    return;
                }
                if (users) {
                    console.log("Account Exists");
                    if (users.password !== req.body.password) {
                        console.log("Incorrect Password");
                        response.message = "Incorrect Password";
                        res.send(response);
                    }
                    if (users.password == req.body.password) {
                        console.log("Correct Password");
                        response.email = users.email;
                        response.message = "Login Successful";
                        response.firstname = users.firstname;
                        response.lastname = users.lastname;
                        response.Validated = true;
                        Project.findOne({ email: req.body.email }, function (err, projects) {
                            if (projects) {
                                response.Projects = projects.Projects;
                            }

                        })
                        res.send(response);
                    }
                }
            })
        }
    }

});


app.use(express.static('public'));

app.listen('80', function () {
    console.log('Server Started on 80...')
});