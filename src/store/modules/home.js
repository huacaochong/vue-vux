import tool from '@/utils/tool'

// initial state
const state = {
  items: {
    data: {
      ad:'',
      adlist:[],
      artlist:[],
      catlist:[],
      goods:[],
      city:'',
      district:'',
      province:'',
      main_ad:'',
      supplier_id:'',
      supplier_name:''
    },
    loaded: false
  },
}

// mutations 同步事务，接收数据->数据整形->改变state变量
const mutations = {
  updateList(state, data) {
    state.items.data = data
  },
  updateDetail(state, data) {
    state.detail = data
  }
}

// actions  异步事务，发起api请求->接收数据->提交到mutation
const actions = {
  getList({commit}, {params,cb}) {
    tool.request('home',params).then((data)=>{
      commit('updateList', data)
      cb && cb(data)
    })
  },
}

export default {
  namespaced: true, //开启命名空间，避免不同module下的actions和mutations重名
  state,
  mutations,
  actions
}
