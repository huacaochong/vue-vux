import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import vux from './modules/vux'
import home from './modules/home'
import region from './modules/region'

Vue.use(Vuex)

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {}

const debug = process.env.NODE_ENV !== "production"
// plugins: debug
//   ? [createLogger()]
//   : [],
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        vux,
        home,
        region
    }
})
