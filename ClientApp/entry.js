import '@babel/polyfill'
import BroadcastChannel from 'broadcast-channel'

import { app } from './app'

app.$mount('#app')

const authChannelOptions = {
    webWorkerSupport: true
  };
  
  const broadcastChannel = new BroadcastChannel("authChannel", authChannelOptions)
  function onMessage (message) {
    console.log(message)
  }
  
  broadcastChannel.onmessage = x => console.log(x)
  