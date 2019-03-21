<template>
  <div class="text-center">
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-3">Welcome to A Test Site</h1>
        <div v-if="getUserName">
          <h3>Welcome Back {{getUserName}}</h3>
        </div>
      </div>
    </div>
    <p></p>
    <div class="form-group">
      <label>
        What is your name?
        <input
          @change="updateUser"
          class="form-control text-center"
          type="text"
          placeholder="Enter Your Name Here..."
        >
      </label>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import clone from "lodash/clone";
import BroadcastChannel from "broadcast-channel";

export default {
  data () {
    return {
      authChannel: null,
      userName: null
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
    getUserName () {
      if (!this.user || !this.user.name) {
        return null;
      }

      return this.user.name;
    }
  },
  methods: {
    ...mapActions({ setUser: "setUser" }),

    async updateUser (event) {
      let user = this.user ? clone(this.user) : {};
      user.name = event.target.value;

      this.setUser(user);

      const jsonValue = JSON.stringify(user)
      console.log('posting message: ' + jsonValue)
      await this.authChannel.postMessage(user)
    },
    authChannelMessageHandler (message) {
      console.log("vue method handler: " + JSON.stringify(message))
    }
  },
  async created () {
    const authChannelOptions = {
      webWorkerSupport: true
    };

    this.authChannel = await new BroadcastChannel("auth", authChannelOptions);
    this.authChannel.addEventListener('message', this.authChannelMessageHandler)
  },
  async beforeDestroy () {
    if(this.authChannel) {
      console.log('before destroy executing and closing authChannel')
      await this.authChannel.close()
    }
  },
  destroyed () {
    console.log('destroyed')
  }
};
</script>

<style>
</style>
