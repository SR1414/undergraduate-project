<template>
<v-app>
  <body class="container">
    <!--------------------------------------------------------------------------------->
    <!-----------------------------------HERE IS WHERE THE USERS LIST OF PROJECTS ARE DISPLAYED---------------------------------------------->
    <div v-if="kabanseen" class="container mt-5">
      <div v-if="render">
        <h2>Your Projects:</h2>
        <ul>
          <li
            v-for="(userprojectsname, index) in userprojectsnames"
            :key="index"
          >{{ index }} - Project Name: {{ userprojectsname }}</li>
        </ul>
      </div>
      <!--------------------------------------------------------------------------------->
      <!------------------------HERE ARE WHERE THE INPUTS ARE KEPT---------------------------------->
      <div class="row form-inline">
        <div class="col form-inline">
          <b-form-input
            id="input-2"
            v-model="newTask"
            required
            placeholder="Enter Task"
            @keyup.enter="add"
          ></b-form-input>
          <v-btn color="primary" @click="add" class="ml-3">Add Task</v-btn>
        </div>
        <b-form-input
          id="input-2"
          v-model="loadname"
          required
          placeholder="Enter Project Name"
          @keyup.enter="load"
        ></b-form-input>,
        <v-btn color="primary" @click="load" class="ml-3">Load Project</v-btn>
        <b-form-input
          id="input-2"
          v-model="savename"
          required
          placeholder="Save Project As:"
          @keyup.enter="save"
        ></b-form-input>
        <v-btn color="primary" @click="save" class="ml-3">Save Project</v-btn>
        <br />
        
      </div>
      <!--------------------------------------------------------------------------------->
      <div class="row mt-5">
        <div class="col-3">
          <div class="p-2 alert alert-secondary">
            <h3>Back Log</h3>
            <!-- Backlog draggable component. Pass arrBackLog to list prop -->
            <draggable class="list-group kanban-column" :list="arrBackLog" group="tasks">
              <div class="list-group-item" v-for="element in arrBackLog" :key="element.name">
                {{ element.name }}
              </div>
            </draggable>
          </div>
        </div>

        <div class="col-3">
          <div class="p-2 alert alert-primary">
            <h3>In Progress</h3>
            <!-- In Progress draggable component. Pass arrInProgress to list prop -->
            <draggable class="list-group kanban-column" :list="arrInProgress" group="tasks">
              <div
                class="list-group-item"
                v-for="element in arrInProgress"
                :key="element.name"
              >{{ element.name }}</div>
            </draggable>
          </div>
        </div>

        <div class="col-3">
          <div class="p-2 alert alert-warning">
            <h3>Testing</h3>
            <!-- Testing draggable component. Pass arrTested to list prop -->
            <draggable class="list-group kanban-column" :list="arrTested" group="tasks">
              <div
                class="list-group-item"
                v-for="element in arrTested"
                :key="element.name"
              >{{ element.name }}</div>
            </draggable>
          </div>
        </div>

        <div class="col-3">
          <div class="p-2 alert alert-success">
            <h3>Done</h3>
            <!-- Done draggable component. Pass arrDone to list prop -->
            <draggable class="list-group kanban-column" :list="arrDone" group="tasks">
              <div
                class="list-group-item"
                v-for="element in arrDone"
                :key="element.name"
              >{{ element.name }}</div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </body>
</v-app>
</template>

<script>
//import draggable
import draggable from "vuedraggable";
import json from "./URL.json";
//var URL = "https://1ec3dd63.ngrok.io";
export default {
  name: "kanban-board",
  components: {
    //import draggable as a component
    draggable
  },
  data() {
    return {
      // for new tasks
      newTask: "",
      // 4 arrays to keep track of our 4 statuses
      arrBackLog: [],
      arrInProgress: [],
      arrTested: [],
      arrDone: [],
      userinfo: "",
      kabanseen: false,
      savename: "",
      loadname: "",
      userprojectsnames: "",
      render: true,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      URL: json.URL
    };
  },
  methods: {
    reRender: function() {
      this.render = false;
      this.render = true;
    },
    //add new tasks method
    add: function() {
      if (this.newTask) {
        this.arrBackLog.push({ name: this.newTask });
        this.newTask = "";
      }
    },
    save: function() {
      //var lol = { name: "Code Sign Up Page" };
      if (this.savename.length == 0) {
        alert("Please Enter Valid Project Name");
        return;
      }
      if (!sessionStorage.getItem("CurrentLoggedUser")) {
        alert("Log in to save project");
        return;
      }
      if (sessionStorage.getItem("CurrentLoggedUser")) {
        var KabanProjectInfo = {
          Backlog: this.arrBackLog,
          InProgress: this.arrInProgress,
          Testing: this.arrTested,
          Done: this.arrDone
        };
        var sentProject = {
          Email: this.userinfo.email,
          ProjectName: this.savename,
          ProjectContents: KabanProjectInfo
        };

        console.log(sentProject);
        fetch(this.URL + "/saveproject", {
          method: "POST",
          // or 'PUT'
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(sentProject)
        })
          .then(response => response.json())
          .then(data => {
            console.log("Success:", data);
            alert(data.message);
            this.checkIfLoggedIn();
            this.reRender();
          })
          .catch(error => {
            if(error){
              console.log("error");
            }
          });
        return;
      }
    },
    load: function() {
      if (this.loadname.length == 0) {
        alert("Enter Project Title to Load");
        return;
      }
      var loadName = {
        projectname: this.loadname,
        email: this.userinfo.email
      };

      fetch(this.URL + "/loadproject", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(loadName)
      })
        .then(response => response.json())
        .then(data => {
          if (data.project.length == 0) {
            alert("Project not found");
            return;
          }
          if(data.project.length !== 0){
          console.log(data.project.ProjectContents.Done);
          this.arrBackLog = data.project.ProjectContents.Backlog;
          this.arrInProgress = data.project.ProjectContents.InProgress;
          this.arrTested = data.project.ProjectContents.Testing;
          this.arrDone = data.project.ProjectContents.Done;
          this.reRender();
          }
        });
    },
    ShowName(ev) {
      console.log(JSON.parse(JSON.stringify(ev)));
    },
    checkIfLoggedIn: function() {
      if (!sessionStorage.getItem("CurrentLoggedUser")) {
        alert("Sign In!")
      }
      if (sessionStorage.getItem("CurrentLoggedUser")) {
        var i = JSON.parse(sessionStorage.getItem("CurrentLoggedUser"));
        var loggeduser = {
          email: i.email,
          firstname: i.firstname,
          lastname: i.lastname
        };
        this.loginseen = false;
        this.LoggedInSeen = false;
        this.userinfo = loggeduser;
        this.kabanseen = true;
        fetch(this.URL + "/getprojectnames", {
          method: "POST",
          // or 'PUT'
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(loggeduser)
        })
          .then(response => response.json())
          .then(data => {
            //console.log(data);
            if (data.projectnames.length !== 0) {
              this.userprojectsnames = data.projectnames;
            }
          });
      }
    }
  },
  beforeMount() {
    this.checkIfLoggedIn();
  }
};
</script>

<style>
/* light stylings for the kanban columns */
.kanban-column {
  min-height: 500px;
}
.container {
  background-color: #1f6aa9;
}
.signhead {
  color: white;
}
.center-block {
  margin: auto;
  display: block;
}
</style>
