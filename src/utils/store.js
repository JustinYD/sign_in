/* eslint-disable eol-last */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        role: {
            openid: '',
            className: '',
            role: '',
            sex: '',
            stuNum: ''
        },
        msg: 'dsfsdfsd'
    },
    mutations: {
        changeMsg(state, value) {
            state.msg = value
        },
        // eslint-disable-next-line space-before-function-paren
        changeRole(state, value) {
            state.role = value
        },
        changeStu(state, value) {
            state.role.role = value
        },
        changeOpenid(state, value) {
            state.role.openid = value
        }
    }
})
export default store