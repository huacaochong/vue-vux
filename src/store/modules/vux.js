// init state
const state = {
    isLoading: false,
    alert: {
        show: false,
        title: '',
        content: '',
        onShow: function () {},
        onHide: function () {}
    },
    toast: {
        show: false,
        text: ''
    }
}
// getters
const getters = {}
// actions
const actions = {
    showLoading({commit}) {
        commit('updateLoadingStatus', {isLoading: true})
    },
    hideLoading({commit}) {
        commit('updateLoadingStatus', {isLoading: false})
    },
    showToast({commit}, text) {
        commit('updateToast', { text: text, show: true})
    }
}
// mutations
const mutations = {
    updateLoadingStatus(state, payload) {
        state.isLoading = payload.isLoading
    },
    updateAlert(state, payload) {
        state.alert = payload.alert
    },
    updateToast(state, payload) {
        state.toast = payload
    }
}
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}