<template>
  <v-app v-if="noteseen">
    <div class="container mt-5">
      <div class="row">
        <div class="col form-inline">
          <v-textarea
            id="input-2"
            v-model="notename"
            required
            background-color="white"
            placeholder="Add Note"
            outlined
            maxlength="500"
            color="white"
            @keyup.enter="add"
          ></v-textarea>
          <v-btn color="primary" @click="add" class="ml-3">Add Note</v-btn>
        </div>
      </div>

      <div class="row">
        <div class="notesbox">
          <div class="p-2 alert alert-secondary">
            <h3>Notes</h3>
            <div class="list-group" :list="arrBacklog" group="tasks">
              <div class="list-group-item" v-for="element in arrBacklog" :key="element.ID">
                <div v-if="dialog == false">{{ element.name }}</div>
                <div v-if="dialog">
                  <v-textarea v-model="element.name" outlined name="input-7-4"></v-textarea>
                  <v-btn color="green" class="mr-4" @click="SaveNote(selectednote)" dark>Save</v-btn>
                </div>
                <v-btn
                  v-if="dialog == false"
                  color="red"
                  class="mr-4"
                  @click="DeleteNote(element)"
                  dark
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  v-if="dialog == false"
                  color="primary"
                  class="mr-5"
                  @click="editnote(element.id)"
                  dark
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import json from "./URL.json";



export default {
  name: "App",
  components: {
    //draggable
  },
  data() {
    return {
      notename: "",
      notedetails: "",
      arrBacklog: [],
      dialog: false,
      selectednote: [],
      URL: json.URL,
      userinfo: "",
      noteseen: false
    };
  },
  beforeMount() {
    this.checkIfLoggedIn();
    this.GetNotes();
  },
  methods: {
    genRandID(length) {
      var tmp = "";
      var availChars = "abcdefghijklmopqrstuvwxyz123456789";
      for (var i = 0; i < length; i++)
        tmp += availChars.charAt(Math.floor(Math.random() * availChars.length));
      return tmp;
    },
    async GetNotes() {
      var serversend = {
        user: this.userinfo.email
      };
      fetch(this.URL + "/getnotes", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          if(data.notes.length == 0){
            console.log(data.message);
            
          }
          if(!data.notes.length == 0){
            console.log(data.message);
            this.arrBacklog = data.notes;
          }
          
        });
    },
    add() {
      if (this.notename) {
        this.arrBacklog.push({
          name: this.notename,
          ID: this.genRandID(12)
        });
        var serversend = {
          user: this.userinfo.email,
          notedetails: this.arrBacklog
        };
        console.log(serversend);
        fetch(this.URL + "/savenote", {
          method: "POST",
          // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(serversend)
        })
          .then(response => response.json())
          .then(data => {
            console.log(JSON.parse(JSON.stringify(data.message)));
            //events.push(data);
          });
        this.notename = "";
        console.log("hello");
      }
    },
    SaveNote(ev) {
      console.log(JSON.stringify(ev));
      console.log(JSON.parse(JSON.stringify(this.arrBacklog)));
      this.dialog = false;
      var serversend = {
        user: this.userinfo.email,
        notedetails: this.arrBacklog
      };
      fetch(this.URL + "/savenote", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          console.log(JSON.parse(JSON.stringify(data.message)));
          //events.push(data);
        });
    },
    DeleteNote(ev) {
      //console.log(JSON.parse(JSON.stringify(ev)));
      var event = ev;
      var aarray = this.arrBacklog;
      //console.log(array.length)
      for (var i = 0; i < aarray.length; i++) {
        if (aarray[i].name == event.name) {
          aarray.splice(i, 1);
          console.log(JSON.parse(JSON.stringify(aarray)));
          console.log(JSON.parse(JSON.stringify(this.arrBacklog)));
        }
        var serversend = {
          user: this.userinfo.email,
          notedetails: this.arrBacklog
        };
        fetch(this.URL + "/savenote", {
          method: "POST",
          // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(serversend)
        })
          .then(response => response.json())
          .then(data => {
            console.log(JSON.parse(JSON.stringify(data.message)));
            //events.push(data);
          });
      }
    },
    editnote(ev) {
      this.selectednote = ev;
      this.dialog = true;
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
        this.userinfo = loggeduser;
        this.noteseen = true;
      }
    }
  }
};
</script>

<style scoped>
.notesbox {
  margin: 0 auto;
  width: 90vh; /*or whatever width you want. */
  /*max-width: 700px;  or whatever width you want. */
  display: inline-block;
}
.mr-4 {
  border: none;
  text-align: right;
  font-size: 15px;
  padding: 10px;
  margin: 5px;
  float: bottom;
  display: block;
}
.mr-5 {
  border: none;
  text-align: right;
  font-size: 15px;
  padding: 10px;
  margin: 5px;
  float: bottom;
  display: block;
}
</style>