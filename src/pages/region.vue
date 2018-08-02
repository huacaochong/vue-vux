<template>
  <div id="Region">
    <!-- 搜索框 -->
    <search
      @result-click="resultClick"
      :results="results"
      v-model="keyWord"
      position="absolute"
      auto-scroll-to-top
      top="0px"
      ref="search"></search>
    <!-- 定位方式 -->
    <div class="position_way">
      <span>{{ current.city }}</span>
      <span>{{current.gps?'GPS定位':''}}</span>
    </div>
    <!-- 热门城市 -->
    <div class="hot_city">
      <h5>热门城市</h5>
      <ul class="citys">
        <li v-for="(item,index) in hotCity" :key="index" @click="resultClick({title: item.city})">{{ item.city }}</li>
      </ul>
    </div>
    <!-- 城市列表 -->
    <div class="city_list">
      <div class="item" v-for="(item,index) in items" :key="index">
        <div class="title">{{ item.name }}</div>
        <cell v-for="(subItem,subIndex) in item.children" :key="subIndex" :title="subItem.name" @click.native="resultClick({title: subItem.name})"></cell>
      </div>
    </div>
  </div>
</template>

<script>
    import { mapActions,mapState } from 'vuex'
    import { Search,Cell } from 'vux'
    export default {
      name: "region",
      components:{
        Search,Cell
      },
      data(){
        return {
          keyWord:'',
        }
      },
      computed:{
        ...mapState({
          current: state=> state.region.current,
          hotCity: state => state.region.hotCity,
          items: state => state.region.items.data
        }),
        cities(){
          let cities = []
          this.items.forEach((region)=>{
            region.children.forEach((city)=>{
              cities.push({
                title: city.name
              })
            })
          })
          return cities
        },
        results(){
          var keyWord = this.keyWord
          if(keyWord){
            return this.cities.filter(function(city){ // city={ 'title':'安庆' }
              return Object.keys(city).some((key)=>{
                return String(city[key]).indexOf(keyWord) > -1;
              })
            })
          }
          // 将过滤之后的数组返回
          return this.cities;
        }
      },
      mounted(){
        this.getHotCity()
        this.getList()
      },
      methods:{
        ...mapActions({
          getHotCity: "region/getHotCity",
          getList: "region/getList",
          changeCurrentCity: "region/changeCurrentCity"
        }),
        resultClick(item){
          this.changeCurrentCity(item.title)
          this.$router.go(-1)
        },
      }
    }
</script>

<style lang="less">
#Region{
  .position_way{
    padding: 10px;
    background: #fff;
    span:last-child{
      color: @secondary-text-color;
      font-size: 12px;
    }
  }
  .hot_city{
    padding: 0px 10px;
    background: #f9f9f9;
    h5{
      padding: 8px 0;
    }
    .citys{
      display: flex;
      flex-flow: row wrap;
      li{
        padding: 4px 20px;
        background: #fff;
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        border-radius: 4px;
      }
    }
  }
  .city_list{
    .item{
      .title{
        padding: 0 10px;
      }
      .weui-cell{
        background: #fff;
      }
      .weui-cell:first-child:before{
        border-top: none!important;
      }
    }
  }
}
</style>
