<template>
  <v-app>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png" />
      <br />
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">Navigation</div>
            <v-list-item-title class="headline mb-1"></v-list-item-title>
            <v-btn color="primary" @click="ShowLogin">Login</v-btn>
            <v-btn color="primary" @click="ShowRegister">Register</v-btn>
            <v-btn color="primary" @click="ShowNotes">Notes</v-btn>
            <v-btn color="primary" @click="ShowKaban">Project Board</v-btn>
            <v-btn color="primary" @click="ShowCalendar">Calendar</v-btn>
            <v-btn color="primary" @click="detectMob">IsMobile</v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions></v-card-actions>
      </v-card>
      <!--<v-btn color="primary" @click="ShowLogin">Login</v-btn>
      <v-btn color="primary" @click="ShowRegister">Register</v-btn>
      <v-btn color="primary" @click="ShowKaban">Show Kaban</v-btn>
      <v-btn color="primary" @click="ShowCalendar">Show Calendar</v-btn>-->
      <Login v-if="LoginSeen" msg="Welcome to Your Vue.js App" />
      <Register v-if="RegisterSeen" msg="Welcome to Your Vue.js App 2" />
      <Kaban v-if="KabanSeen" />
      <Notes v-if="NotesSeen" />
      <Calendar v-if="CalendarSeen" />
    </div>
  </v-app>
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Kaban from "./components/Kaban.vue";
import Calendar from "./components/Calendar";
import Notes from "./components/Notes";

export default {
  name: "App",
  data() {
    return {
      LoginSeen: false,
      RegisterSeen: false,
      KabanSeen: false,
      CalendarSeen: false,
      NotesSeen: false
    };
  },
  components: {
    Login,
    Register,
    Kaban,
    Calendar,
    Notes
  },
  methods: {
    methods: {
      detectMob: function() { 
        console.log(navigator.userAgent);
      },
      isMobile() {
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        ) {
          alert("true");
        } else {
          alert("true");
        }
      }
    },
    ShowLogin: function() {
      this.LoginSeen = true;
      this.RegisterSeen = false;
      this.KabanSeen = false;
      this.CalendarSeen = false;
      this.NotesSeen = false;
    },
    ShowRegister: function() {
      this.LoginSeen = false;
      this.RegisterSeen = true;
      this.KabanSeen = false;
      this.CalendarSeen = false;
      this.NotesSeen = false;
    },
    ShowKaban: function() {
      this.LoginSeen = false;
      this.RegisterSeen = false;
      this.KabanSeen = true;
      this.CalendarSeen = false;
      this.NotesSeen = false;
    },
    ShowCalendar: function() {
      this.LoginSeen = false;
      this.RegisterSeen = false;
      this.KabanSeen = false;
      this.CalendarSeen = true;
      this.NotesSeen = false;
    },
    ShowNotes: function() {
      this.LoginSeen = false;
      this.RegisterSeen = false;
      this.KabanSeen = false;
      this.CalendarSeen = false;
      this.NotesSeen = true;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
