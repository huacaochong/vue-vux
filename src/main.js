// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import FastClick from 'fastclick'
import store from './store'
import tools from '@/utils/tool'

FastClick.attach(document.body)
Vue.use(VueRouter)
Vue.use(Vuex)

// 插件
import  momentPlugin from './plugins/moment'
import VueScroller from 'vue-scroller'
import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)
Vue.use(VueScroller)
Vue.use(momentPlugin)
// 使用高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
    key: '557e2cea68451d4dd23806c9441d40bd',
    plugin: ['AMap.CitySearch','AMap.Geocoder'],
    v: '1.4.4'
});

// 微信登录
let open_id = tools.getCookie('open_id')
if(!open_id){
  open_id = 'onGsh09UmVOEbLDBSn2RIeVMTqe8'
}
tools.setStorage('open_id',open_id)

// 在build/webpack.base.conf.js, 页面路由会根据 pages.json 的配置自动生成替换
let routes = []
const router = new VueRouter({
    routes
})
router.beforeEach(function (to, from, next) {
  store.commit('vux/updateLoadingStatus', {isLoading: true})
next()
})
router.afterEach(function (to) {
  store.commit('vux/updateLoadingStatus', {isLoading: false})
})
sync(store, router)





Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export { router, store }
