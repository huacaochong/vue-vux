<template>
  <div id="app">
    <view-box ref="viewBox">
      <router-view/>
    </view-box>

    <div v-transfer-dom>
      <loading :show="isLoading"></loading>
    </div>
    <alert v-model="alert.show" :title="alert.title" :content="alert.content" @on-show="alert.onShow" @on-hide="alert.onHide"></alert>
    <toast v-model="toast.show" type="text" :text="toast.text"></toast>
  </div>
</template>

<script>
import {  ViewBox, Loading, TransferDom, Alert, Toast } from 'vux'
import { mapActions,mapState } from 'vuex'
export default {
  name: 'App',
  directives: {
    TransferDom
  },
  components:{
    ViewBox, Loading, TransferDom, Alert, Toast
  },
  computed:{
    ...mapState({
      route: state => state.route,
      isLoading: state => state.vux.isLoading,
      alert: state => state.vux.alert,
      toast: state => state.vux.toast
    }),
    title() {
      if (this.route.meta.title) return this.route.meta.title;
      if (this.route.name) return this.route.name;
      return "";
    }
  },
  watch: {
    //监听变量
    title: function(val) {
      document.title = val;
    }
  },
  data(){
    return {

    }
  },
  methods:{
    ...mapActions({})
  }

}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/tap.less";
@import "./assets/less/global.less";
@import "./assets/less/iconfont.less";
#app{
  height:100%;
}
</style>
