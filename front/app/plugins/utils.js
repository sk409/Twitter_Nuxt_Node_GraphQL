import Vue from "vue";

Vue.prototype.$serverUrl = path => process.env.serverOrigin + "/" + path;
Vue.prototype.$transition = route => (location.href = route);
