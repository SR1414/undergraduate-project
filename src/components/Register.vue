<template>
  <v-app>
    <div class="signup" id="reg">
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">Sign Up</div>
            <v-list-item-title class="headline mb-1">Email:</v-list-item-title>
            <v-text-field
              class="center-block"
              v-model="email"
              label="Enter your Email:"
              style="width:300px;"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-list-item-title class="headline mb-1">Firstname:</v-list-item-title>
            <v-text-field
              class="center-block"
              v-model="firstname"
              label="Enter your First Name:"
              style="width:300px;"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-list-item-title class="headline mb-1">Lastname:</v-list-item-title>
            <v-text-field
              class="center-block"
              v-model="lastname"
              label="Enter your Last Name:"
              style="width:300px;"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <v-list-item-title class="headline mb-1">Password:</v-list-item-title>
            <v-text-field
              class="center-block"
              v-model="password"
              label="Enter Password:"
              :type="'password'"
              style="width:300px;"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
          <v-btn
            color="primary"
            type="submit"
            value="submit"
            @click="Getusersfromdb"
            class="ml-3"
          >Submit</v-btn>
        </v-card-actions>
      </v-card>
      
    </div>
  </v-app>
</template>

<script>
//var URL = "https://1ec3dd63.ngrok.io";
import json from './URL.json'
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ],
      URL: json.URL
    };
  },
  methods: {
    Getusersfromdb: function getusers() {
      var data = {
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        password: this.password
      };
      if (!this.email || !this.firstname || !this.lastname || !this.password) {
        alert("Ensure all fields are filled in with valid information");
        return;
      }
      //asks server for list of users and checks if it is empty or not
      fetch(this.URL + "/newuser", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.message);
          console.log(data.AccountCreated == true);
          if (data.AccountCreated == true) {
            this.email = "";
            this.firstname = "";
            this.lastname = "";
            this.password = "";
          }
          alert(data.message);
        });
    }
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
