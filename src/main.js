import Vue from 'vue'
import App from './App'
import fly from './utils/request'
Vue.prototype.$http = fly;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()