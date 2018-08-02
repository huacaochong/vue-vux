<template>
  <div id="Home">
    <!--首页轮播-->
    <Swiper dots-position="center" :auto="true" :loop="true" class="banner">
      <Swiper-item v-for="(item,index) in items.adlist" :key="index">
        <img :src="item.img" alt="">
      </Swiper-item>
    </Swiper>
    <!--定位搜索功能-->
    <div class="position-search">
      <div class="position" @click="linkTo('/region')">
        <img src="static/imgs/positioning.png" alt=""/>
        <span>{{ current_city }}</span>
        <img src="static/imgs/down.png" alt=""/>
      </div>
      <div class="search">
        <input type="text" :placeholder="items.main_ad"/>
        <img src="static/imgs/search.png" alt=""/>
      </div>
    </div>
    <BottomBar selected_item="home"></BottomBar>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import helper from '@/mixins/helper'
  import {Swiper, SwiperItem} from "vux"
  import BottomBar from "@/components/BottomBar"

  export default {
    components: {BottomBar, Swiper, SwiperItem},
    mixins: [helper],
    data() {
      return {}
    },
    computed: {
      ...mapState({
        items: state => state.home.items.data,
        current_city: state => state.region.current.city,
        currentPosition: state => state.region.current
      })
    },
    mounted() {
      this.showLoading()
      this.getCity()
    },
    watch: {
      // 城市发生变化，首页的信息做出改变
      current_city(){
        this.getList({
          params:{
            lat: this.currentPosition.lat,
            lng: this.currentPosition.lng,
            supplier_id:''
          },
          cb:()=>{
            this.hideLoading()
          }
        })
      }
    },
    methods: {
      ...mapActions({
        getList: 'home/getList',
        getCurrentCity: 'region/getCurrentCity'
      }),
      getCity(){
        if(this.current_city == ''){
        //  获取定位信息
          this.getCurrentCity()
        }else{
        //  请求首页数据
          this.getList({
            params:{
              lat: this.currentPosition.lat,
              lng: this.currentPosition.lng,
              supplier_id:''
            },
            cb:()=>{
              this.hideLoading()
            }
          })
        }
      }
    }
  }
</script>

<style lang="less">
  #Home {
    .banner {
      width: 100vw;
      height: 180px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .position-search {
      padding: 10px;
      box-sizing: border-box;
      background: @theme-color-6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      .position {
        display: flex;
        align-items: center;
        width: 28%;
        img:first-child {
          width: 20px;
          height: 20px;
        }
        img {
          width: 14px;
          height: 14px;
        }
        span {
          display: inline-block;
          margin-right: 4px;
          font-size:15px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
      .search {
        width: 72%;
        position: relative;
        img {
          width: 18px;
          height: 18px;
          position: absolute;
          left: 5px;
          top: 7px;
        }
        input {
          width: 100%;
          height: 32px;
          line-height: 32px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          padding-left: 27px;
          box-sizing: border-box;
          background: #f2f2f2;
        }
      }
    }
  }
</style>
