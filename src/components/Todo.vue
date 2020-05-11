<template>
<v-app>
  <body class="container">
    <div width="90vh" height="90vh">
      <v-text-field
        background-color="white"
        type="text"
        class="todo-input"
        label="What needs to be done"
        style="width:300px;"
        :rules="rules"
        hide-details="auto"
        outlined
        v-model="newTodo"
        @keyup.enter="addTodo"
      ></v-text-field>
      <transition-group
        name="fade"
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <div v-for="(todo, index) in todosFiltered" :key="todo.id" class="todo-item">
          <div class="todo-item-left">
            <v-checkbox type="checkbox" @change="SaveNote" v-model="todo.completed"></v-checkbox>
            <div
              v-if="!todo.editing"
              @dblclick="editTodo(todo)"
              class="todo-item-label"
              :class="{ completed : todo.completed }"
            >{{ todo.title }}</div>
            <input
              v-else
              class="todo-item-edit"
              type="text"
              v-model="todo.title"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
              v-focus
            />
          </div>
          <v-btn color="red" class="mr-4" @click="removeTodo(index)" dark>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </transition-group>

      <div class="extra-container">
        <div>
          <label>
            <v-checkbox
              type="checkbox"
              :label="'Check All'"
              :checked="!anyRemaining"
              @change="SaveNote"
              @click="checkAllTodos"
            ></v-checkbox>
            <h4>{{ remaining }} items left</h4>
          </label>
        </div>
        <div></div>
      </div>

      <div class="extra-container2">
        <div>
          <v-btn :class="{ active: filter == 'all' }" @click="filter = 'all'" color="secondary">All</v-btn>
          <v-btn
            :class="{ active: filter == 'active' }"
            @click="filter = 'active'"
            color="secondary"
          >Active</v-btn>
          <v-btn
            :class="{ active: filter == 'completed' }"
            @click="filter = 'completed'"
            color="secondary"
          >Completed</v-btn>
        </div>

        <div>
          <transition name="fade">
            <v-btn
              v-if="showremovefinishedButton"
              @click="removefinished"
              color="secondary"
            >Completed</v-btn>
          </transition>
        </div>
      </div>
    </div>
  </body>
</v-app>
</template>

<script>
import json from "./URL.json";
export default {
  name: "todo-list",
  data() {
    return {
      newTodo: "",
      idForTodo: 3,
      beforeEditCache: "",
      filter: "all",
      todos: [
        {
          id: 1,
          title: "Finish Vue Screencast",
          completed: false,
          editing: false
        },
        {
          id: 2,
          title: "Take over world",
          completed: false,
          editing: false
        }
      ],
      userinfo: "",
      URL: json.URL
    };
  },
  beforeMount() {
    this.checkIfLoggedIn();
    this.getTodos();
  },
  computed: {
    remaining() {
      return this.todos.filter(todo => !todo.completed).length;
    },
    anyRemaining() {
      return this.remaining != 0;
    },
    todosFiltered() {
      if (this.filter == "all") {
        return this.todos;
      } else if (this.filter == "active") {
        return this.todos.filter(todo => !todo.completed);
      } else if (this.filter == "completed") {
        return this.todos.filter(todo => todo.completed);
      }
      return this.todos;
    },
    showremovefinishedButton() {
      return this.todos.filter(todo => todo.completed).length > 0;
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    SaveNote() {
      var serversend = {
        user: this.userinfo.email,
        todo: this.todos
      };
      fetch(this.URL + "/savetodo", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
    },
    addTodo() {
      if (this.newTodo.trim().length == 0) {
        return;
      }
      this.todos.push({
        id: this.idForTodo,
        title: this.newTodo,
        completed: false,
        editing: false
      });
      this.newTodo = "";
      this.idForTodo++;
      var serversend = {
        user: this.userinfo.email,
        todo: this.todos
      };
      fetch(this.URL + "/savetodo", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
    },
    editTodo(todo) {
      this.beforeEditCache = todo.title;
      todo.editing = true;
    },
    doneEdit(todo) {
      if (todo.title.trim() == "") {
        todo.title = this.beforeEditCache;
      }
      todo.editing = false;
      var serversend = {
        user: this.userinfo.email,
        todo: this.todos
      };
      fetch(this.URL + "/savetodo", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
    },
    cancelEdit(todo) {
      todo.title = this.beforeEditCache;
      todo.editing = false;
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
      var serversend = {
        user: this.userinfo.email,
        todo: this.todos
      };
      fetch(this.URL + "/savetodo", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
    },

    checkAllTodos() {
      this.todos.forEach(todo => (todo.completed = event.target.checked));
    },
    removefinished() {
      this.todos = this.todos.filter(todo => !todo.completed);
      this.SaveNote();
    },
    checkIfLoggedIn: function() {
      if (sessionStorage.getItem("CurrentLoggedUser")) {
        var i = JSON.parse(sessionStorage.getItem("CurrentLoggedUser"));
        var loggeduser = {
          email: i.email,
          firstname: i.firstname,
          lastname: i.lastname
        };
        this.userinfo = loggeduser;
      }
    },
    getTodos() {
      var serversend = {
        user: this.userinfo.email,
        todo: this.todos
      };
      fetch(this.URL + "/gettodo", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serversend)
      })
        .then(response => response.json())
        .then(data => {
          this.todos = data.todo;
        });
    }
  }
};
</script>

<style >
.container {
  min-height: 500px;
  min-width: 500px;
}
.todo-input {
  width: 100%;
  padding: 10px 18px;
  font-size: 18px;
  margin-bottom: 16px;
}
.todo-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation-duration: 0.3s;
  background-color: cyan;
}
.remove-item {
  cursor: pointer;
  margin-left: 14px;
}
.todo-item-left {
  display: flex;
  align-items: center;
}
.todo-item-label {
  padding: 10px;
  border: 1px solid white;
  margin-left: 12px;
}
.todo-item-edit {
  font-size: 24px;
  color: #2c3e50;
  margin-left: 12px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
}
.completed {
  text-decoration: line-through;
  color: grey;
}
.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;
}
.extra-container2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;
  background-color: white;
}
button {
  font-size: 14px;
  background-color: white;
  appearance: none;
}
.active {
  background: lightgreen;
}
</style>