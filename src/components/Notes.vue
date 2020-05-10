<template>
  <v-app>
    <div class="container mt-5">
      <div class="row">
        <div class="col form-inline">
          <b-form-input
            id="input-2"
            v-model="notename"
            required
            placeholder="Enter Task"
            @keyup.enter="add"
          ></b-form-input>
          <v-btn color="primary" @click="add" class="ml-3">Add Task</v-btn>
          <v-btn color="primary" @click="Test" class="ml-3">Add Task</v-btn>
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
                  <v-textarea v-model="element.name"  outlined name="input-7-4"></v-textarea>
                  <v-btn color="green" class="mr-4" @click="SaveNote(selectednote)" dark>
                    Save
                </v-btn>
                </div>
                <v-btn v-if="dialog == false" color="red" class="mr-4" @click="DeleteNote(element)" dark>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn v-if="dialog == false" color="primary" class="mr-5" @click="editnote(element)" dark>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <!--<v-dialog v-model="dialog" max-width="500">
                  <v-card>
                    <v-container>
                      <v-form>
                        <v-textarea
                          name="input-7-1"
                          color="gray"
                          label="Note"
                          v-model="selectednote.name"
                        ></v-textarea>
                        <v-btn
                          color="primary"
                          class="createnote"
                          @click="SaveNote(selectednote.name)"
                        >Save Note</v-btn>
                      </v-form>
                    </v-container>
                  </v-card>
                </v-dialog>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
//import draggable from "vuedraggable";
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
      URL: json.URL
    };
  },
  methods: {
    genRandID(length) {
      var tmp = "";
      var availChars = "abcdefghijklmopqrstuvwxyz123456789";
      for (var i = 0; i < length; i++)
        tmp += availChars.charAt(Math.floor(Math.random() * availChars.length));
      return tmp;
    },
    add() {
      if (this.notename) {
        this.arrBacklog.push({ 
          name: this.notename,
          ID: this.genRandID(12)
         });
        this.notename = "";
        console.log("hello");
      }
    },
    SaveNote(ev) {
      console.log(ev);
      this.dialog = false;
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
          break;
        }
      }
    },
    editnote(ev) {
      this.selectednote = ev;
      this.dialog = true;
    },
    Test() {
      var data = {
        message: "hello"
      };
      fetch(this.URL + "/test1", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log(JSON.parse(JSON.stringify(data)));
          //events.push(data);
        });
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