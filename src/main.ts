import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from 'axios'

axios.defaults.baseURL = 'https://api.covid19india.org'
axios.defaults.headers = {
  'Authorization': 'Bearer' + ' your token',
  "Content-Type": "application/json",
  };
axios.defaults.withCredentials = true;
axios.defaults.timeout = 1000;
axios.defaults.maxContentLength = 100000;
axios.defaults.maxBodyLength = 100000;
axios.defaults.proxy = {
  protocol: 'https',
  host: '127.0.0.1',
  port: 9000,
  auth: {
    username: 'test',
    password: 'test'
  }
};
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300;
};


createApp(App)
  .use(router)
  .mount("#app");
