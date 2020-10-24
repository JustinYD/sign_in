import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        role: '',
        msg: 'dsfsdfsd'
    },
    mutations: {
        changeMsg(state, value) {
            state.msg = value
        },
        changeRole(state, value) {
            state.role = value
        }
    }
});
export default store