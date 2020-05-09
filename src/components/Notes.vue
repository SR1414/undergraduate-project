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
            <draggable class="list-group" :list="arrBacklog" group="tasks">
              <div class="list-group-item" v-for="element in arrBacklog" :key="element.name">
                {{ element.name }}
                <v-btn
                  color="red"
                  class="mr-4"
                  @click="DeleteNote(element)"
                  dark
                >
                <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn color="primary" class="mr-5" @click="dialog = true" dark>
                  <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                <v-dialog v-model="dialog" max-width="500">
                  <v-card>
                    <v-container>
                      <v-form>
                        <div>{{ element.name }}</div>
                        <v-btn
                          type="submit"
                          color="primary"
                          class="mr-4"
                          @click.stop="dialog = false"
                        >create event</v-btn>
                      </v-form>
                    </v-container>
                  </v-card>
                </v-dialog>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "App",
  components: {
    draggable
  },
  data() {
    return {
      notename: "",
      notedetails: "",
      arrBacklog: [],
      dialog: false
    };
  },
  methods: {
    add() {
      if (this.notename) {
        this.arrBacklog.push({ name: this.notename });
        this.notename = "";
        console.log("hello");
      }
    },
    DeleteNote(ev) {
      //console.log(JSON.parse(JSON.stringify(ev)));
      var event = ev;
      var aarray = this.arrBacklog
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
    Test() {
      var data = {
        message: "hello"
      }
      fetch("http://localhost:80/test1", {
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
  float: right;
  display: block;
}
.mr-5 {
   border: none;
  text-align: right;
  font-size: 15px;
  padding: 10px;
  margin: 5px;
  float: right;
  display: block;
}

</style>