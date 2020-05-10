<template>
  <v-app>
    <div>
      <div v-if="loginseen" class="login" id="loginform">
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Login</div>
              <v-list-item-title class="headline mb-1">Email:</v-list-item-title>
              <v-text-field
                class="center-block"
                v-model="email"
                label="Enter your Email"
                style="width:300px;"
                :rules="rules"
                hide-details="auto"
              ></v-text-field>
              <v-list-item-title class="headline mb-1">Password:</v-list-item-title>
              <v-text-field
                type="password"
                class="center-block"
                v-model="password"
                label="Enter a Password"
                style="width:300px;"
                :rules="rules"
                hide-details="auto"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn color="primary" @click="login" class="ml-3">Login</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-if="LoggedInSeen">
        <h1>User Info</h1>
        <br />
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">User Info</div>
              <v-list-item-title class="headline mb-1">Email:</v-list-item-title>
              <v-list-item-subtitle>{{ userinfo.email }}</v-list-item-subtitle>
              <v-list-item-title class="headline mb-1">Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userinfo.firstname }} {{ userinfo.lastname }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn color="primary" @click="LogOut" class="ml-3">Log Out</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
import json from './URL.json'
//var URL = "https://1ec3dd63.ngrok.io";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      email: "",
      password: "",
      loginseen: true,
      LoggedInSeen: false,
      userinfo: "",
      URL: json.URL,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ]
    };
  },
  methods: {
    login: function loguserin() {
      var logdata = {
        email: this.email,
        password: this.password
      };

      if (!this.email || !this.password) {
        alert("Ensure all fields are filled in with valid information");
        return;
      }
      console.log(logdata);
      fetch(this.URL + "/loguser", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(logdata)
      })
        .then(response => response.json())
        .then(data => {
          if (data.Validated == true) {
            sessionStorage.setItem("CurrentLoggedUser", JSON.stringify(data));
            console.log(sessionStorage.getItem("CurrentLoggedUser"));
            this.loginseen = false;
            this.LoggedInSeen = true;
            this.checkIfLoggedIn();
          }
          alert(data.message);
        });
    },
    checkIfLoggedIn: function() {
      if (sessionStorage.getItem("CurrentLoggedUser")) {
        this.loginseen = false;
        this.LoggedInSeen = false;
        var i = JSON.parse(sessionStorage.getItem("CurrentLoggedUser"));
        var loggeduser = {
          email: i.email,
          firstname: i.firstname,
          lastname: i.lastname
        };
        this.userinfo = loggeduser;
        this.LoggedInSeen = true;
        this.loginseen = false;
      }
    },
    LogOut: function() {
      sessionStorage.removeItem("CurrentLoggedUser");
      this.loginseen = true;
      this.LoggedInSeen = false;
    },
  },
  beforeMount() {
    this.checkIfLoggedIn();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.center-block {
  margin: auto;
  display: block;
}
</style>
