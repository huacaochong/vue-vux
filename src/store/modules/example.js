import tool from '@/utils/tool'

// initial state
const state = {
    items: {
        data: [],
        page: 1,
        nomore: false,
        loaded: false
    },
    detail: {
        id: "",
        name: ""
    },
    search: {
        key: tool.getStorage("example_search_key", '')
    }
}

// mutations 同步事务，接收数据->数据整形->改变state变量
const mutations = {
    updateList(state, data) {
        state.items = data
    },
    updateDetail(state, data) {
        state.detail = data
    },
    updateSearch(state, data) {
        state.search = tool.setStorage("example_search", data, state.search)
    }
}

// actions  异步事务，发起api请求->接收数据->提交到mutation
const actions = {
    getList({commit}, cb) {
        var params = state.search
        tool.request('example_list',params).then((data)=>{
            var rs = {
                data: data,
                loaded: true,
                page:1,
                nomore: data.length < 10,
            }
            commit('updateList', rs)
            cb && cb(data)
        })
    },
    loadMore({commit}, cb) {
        if(!state.items.loaded){
            //等待第一页加载完成
            cb && cb()
            return false
        }
        var params = state.search
        params.page = state.items.page + 1
        tool.request('example_list',params).then((data)=>{
            var rs = {
                data: state.items.data.concat(data),
                loaded: true,
                page:params.page,
                nomore: data.length < 10,
            }
            commit('updateList', rs)
            cb && cb(data)
        })
    },
    getDetail({commit}, {id, cb}) {
        var params = {
            id
        }
        tool.request('example_detail',params).then((data)=>{
            commit('updateDetail', data)
            cb && cb(data)
        })
    },
    create({commit}, {params,cb}) {
        tool.request('example_create',params,'post').then((data)=>{
            commit('updateDetail', data)
            cb && cb(data)
        })
    },
    update({commit}, {params,cb}) {
        tool.request('example_update',params,'post').then((data)=>{
            commit('updateDetail', data)
            cb && cb(data)
        })
    },
    remove({commit}, {params,cb}) {
        tool.request('example_remove',params,'post').then((data)=>{
            cb && cb(data)
        })
    },
    updateSearch({commit}, data) {
        commit('updateSearch', data)
    }
}

export default {
    namespaced: true, //开启命名空间，避免不同module下的actions和mutations重名
    state,
    mutations,
    actions
}
