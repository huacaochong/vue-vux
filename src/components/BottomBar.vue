<template>
    <tabbar class="bottom-tabbar" icon-class="vux-center">
        <tabbar-item :link="{path:'/'}" :selected="is_selected('home')">
            <span class="iconfont" :class="{'icon-tab_home_nor1':!is_selected('home'),'icon-tab_home_pre1':is_selected('home')}" slot="icon"></span>
            <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/inquiry/create'}" :selected="is_selected('inquiry')">
            <span class="iconfont" :class="{'icon-tab_xunjia_nor':!is_selected('inquiry'),'icon-tab_xunjia_pre1':is_selected('inquiry')}" slot="icon"></span>
            <span slot="label">询价</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/choose'}" :selected="is_selected('choose')">
            <span class="iconfont" :class="{'icon-tab_zixuan_nor1':!is_selected('choose'),'icon-tab_zixuan_pre1':is_selected('choose')}"  slot="icon"></span>
            <span slot="label">自选</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/person'}" :selected="is_selected('person')">
            <span class="iconfont" :class="{'icon-tab_me_nor1':!is_selected('person'),'icon-tab_me_pre1':is_selected('person')}"  slot="icon"></span>
            <span slot="label">我的</span>
        </tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from "vux";
import helper from "@/mixins/helper";
export default {
  components: { Tabbar, TabbarItem },
  mixins: [helper],
  props: {
    selected_item: String
  },
  methods: {
    is_selected(item) {
      return item === this.selected_item;
    }
  }
};
</script>

<style lang="less">
.bottom-tabbar {
  background: #fff;
  span {
    color: #666;
  }
  .weui-bar__item_on {
    span {
      color: @theme-color-6 !important;
    }
  }
}
</style>
