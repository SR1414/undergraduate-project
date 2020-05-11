<template>
  <v-app>
    <div class="signindiv" v-if="calendarsignseen">
      <h1 class="signhead">Sign in to see calendar</h1>
    </div>
    <v-row v-if="calendarseen" class="fill-height">
      <v-col>
        <!-------------------------------------TOP OF THE CALENDAR--------------------------------------------------------->
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn color="primary" class="mr-4" @click="dialog = true" dark>Add Event</v-btn>
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn outlined color="grey darken-2" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <!---------------------------------------------------------------------------------------------->
        <!-------------------------------DIALOG BOX for creating an appointment on the calendar---------------------------------------------->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addEvent">
                <v-text-field v-model="name" type="text" label="event name (required)"></v-text-field>
                <v-text-field v-model="details" type="text" label="detail"></v-text-field>
                <v-text-field v-model="start" type="date" label="start (required)"></v-text-field>
                <v-text-field v-model="end" type="date" label="end (required)"></v-text-field>
                <v-text-field v-model="color" type="color" label="color (click to open color menu)"></v-text-field>
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
        <v-sheet height="600">
          <!--------------------------------Vueify componenet that shows the caledar-------------------------------------------------->
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <!---------------------------------------------------------------------------------------------->
          <!-----------------------------------------POPUP BOX that displays appointment and Options----------------------------------------------------->
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x>
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <form v-if="currentlyEditing !== selectedEvent.id">{{selectedEvent.details}}</form>
                <form v-else>
                  <textarea-autosize
                    v-model="selectedEvent.details"
                    type="text"
                    style="width: 100%"
                    :min-height="100"
                    placeholder="add note"
                  ></textarea-autosize>
                </form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">Close</v-btn>
                <v-btn
                  text
                  v-if="currentlyEditing !== selectedEvent.id"
                  @click.prevent="editEvent(selectedEvent)"
                >Edit</v-btn>
                <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <!---------------------------------------------------------------------------------------------->
        </v-sheet>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
//var URL = "https://1ec3dd63.ngrok.io";
import json from './URL.json'


export default {
  data: () => ({
    today: new Date().toISOString().substring(0, 10),
    focus: new Date().toISOString().substring(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#1976D2",
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    calendarseen: false,
    calendarsignseen: true,
    userinfo: "",
    URL: json.URL
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    /*    CHANGES HOW THE CALENDAR IS FORMATED           */
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  /*    BEFORE ANYTHING THE APP CHECK IF THE USER IS LOGGED IN AND RETRIEVES APPOINTMENTS       */
  mounted() {
    this.getEvents();
    this.checkIfLoggedIn();
    this.$refs.calendar.checkChange();
  },
  methods: {
    /*    SENDS A REQUEST TO THE SERVER THAT WILL SEND THE USERS APPOINTMENTS BACK USING FETCH       */
    async getEvents() {
      //var snapshot = await db.collection("calEvent").get();
      //var events = [];
      var i = JSON.parse(sessionStorage.getItem("CurrentLoggedUser"));
      var loggeduser = {
        email: i.email,
        firstname: i.firstname,
        lastname: i.lastname
      };
      console.log(loggeduser.email);
      await fetch(this.URL + "/getcalendar", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loggeduser)
      })
        .then(response => response.json())
        .then(data => {
          console.log(JSON.parse(JSON.stringify(data)));
          //events.push(data);
          this.events = data;
        });
      //snapshot.forEach(doc => {
      //var appData = doc.data();
      //appData.id = doc.id;
      //events.push(appData);
      //this.events = events;
      //});
      //console.log(JSON.parse(JSON.stringify(this.events)))
    },
    /*    CREATES A NEW EVENT AND THEN SENDS IT TO THE SERVER TO BE ADDED TO THE DATABASE       */
    async addEvent() {
      if (this.name && this.start && this.end) {
        var data = {
          user: this.userinfo.email,
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        };
        await fetch(this.URL + "/addcalendar", {
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
          alert(data.message);
        });
        alert("hello");
        this.name = "";
        this.details = "";
        this.start = "";
        this.end = "";
        this.color = "#1976D2";
        this.getEvents();
      } else {
        alert("Name, Start and End Date are required");
      }
    },
    /*    CHANGES TO EXISTING APPOINTMENTS ARE SEND TO THE SERVER TO UPDATE THE DATABASE       */
    async updateEvent(event) {
      //await db
      //.collection("calEvent")
      //.doc(this.currentlyEditing)
      //.update({
      //details: event.details
      //});
      var update = {
        user: this.userinfo.email,
        selectedcalendar: this.currentlyEditing,
        update: event.details
      };
      await fetch(this.URL + "/updatecalendar", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(update)
      })
        .then(response => response.json())
        .then(data => {
          console.log(JSON.parse(JSON.stringify(data)));
          alert(data.message);
        });
      this.selectedOpen = false;
      this.currentlyEditing = null;
      this.getEvents();
    },
    /*    SENDS THE APPOINTMENTS ID TO THE SERVER TO DELETE IN THE DATABASE       */
    async deleteEvent(event) {
      //await db
      //.collection("calEvent")
      //.doc(event)
      //.delete();
      var tobedeleted = {
        user: this.userinfo.email,
        ToDelete: event
      };
      await fetch(this.URL + "/deletecalendar", {
        method: "POST",
        // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tobedeleted)
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
        });
      this.selectedOpen = false;
      this.getEvents();
    },
    /*    USING A MENU OPTION, IT CHANGES THE CALENDAR TO JUST DISPLAY THE DAY AND ITS APPOINTMENTS       */
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    editEvent(event) {
      this.currentlyEditing = event.id;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: this.formatDate(first, !allDay),
          end: this.formatDate(second, !allDay),
          color: this.colors[this.rnd(0, this.colors.length - 1)]
        });
      }

      this.start = start;
      this.end = end;
      this.events = events;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },
    /*    CHECKS IF THE USER IS LOGGED IN BY CHECKING SESSION STORAGE, IF NOT THEN THE CALENDAR WILL BE HIDDEN AND A DIV WILL SHOW TELLING THE USER TO LOG IN       */
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
        this.calendarseen = true;
        this.calendarsignseen = false;
        this.getEvents();
      }
      if (!sessionStorage.getItem("CurrentLoggedUser")) {
        this.calendarseen = false;
        this.calendarsignseen = true;
      }
    },
    beforeMount() {
      this.checkIfLoggedIn();
    }
  }
};
</script>

<style scoped>
.signhead {
  color: black;
}
.signindiv {
  background-color: white;
}
</style>