import tool from '@/utils/tool'
var loading_times=0
// initial state
const state = {
  items: {
    data: [],
    page: 1,
    nomore: false,
    loaded: false
  },
  current:{
    province: localStorage.getItem("province") ? localStorage.getItem("province") : '',
    city: localStorage.getItem("city") ? localStorage.getItem("city") : '',
    lat: localStorage.getItem("lat") ? localStorage.getItem("lat") : '',
    lng: localStorage.getItem("lng") ? localStorage.getItem("lng") : '',
    gps: localStorage.getItem("gps") ? localStorage.getItem("gps") : true,
  },
  hotCity:[]
}

// mutations 同步事务，接收数据->数据整形->改变state变量
const mutations = {
  updateCurrent (state, data) {
    localStorage.setItem("province",data.province)
    localStorage.setItem("city",data.city)
    localStorage.setItem('lat',data.lat)
    localStorage.setItem('lng',data.lng)
    localStorage.setItem("gps",data.gps)
    state.current = data
  },
  updateHotCity(state,data){
    state.hotCity = data
  },
  updateList(state,data){
    state.items.data = data
  }
}

// actions  异步事务，发起api请求->接收数据->提交到mutation
const actions = {
  /**
   * 获取当前城市
   * @param commit
   * @param cb
   */
  getCurrentCity({commit},cb){
    if(typeof(AMap)!='undefined'){
      var citysearch = new AMap.CitySearch();
      citysearch.getLocalCity(function(status, result) {
        var rs = {
          province:'安徽省',
          city: '合肥市',
          lat:'31.779246',
          lng:'117.160703',
          gps: true
        }
        if (status === 'complete' && result.info === 'OK') {
          let latLng = result.rectangle.split(';')[0]
          rs.province = result.province;
          rs.city = result.city;
          rs.lng = latLng.split(',')[0]
          rs.lat = latLng.split(',')[1]
        }
        commit('updateCurrent', rs)
        cb && cb()
      });
    }else{
      //等待地图组件加载完成
      loading_times++
      if(loading_times<10){
        console.log('loading map')
        let self = this
        setTimeout(()=>{
          self.dispatch("region/getCurrentCity",cb)
        },300);
      }else{
        var rs = {
          province:'安徽省',
          city: '合肥市',
          lat:'31.779246',
          lng:'117.160703',
          gps: true
        }
        commit('updateCurrent', rs)
      }
    }
  },
  /**
   * 获取热门城市
   * @param commit
   * @param cb
   */
  getHotCity({commit},cb){
    tool.request('hot_city',{}).then((data)=>{
      commit('updateHotCity',data)
      cb && cb(data)
    })
  },
  /**
   * 获取城市列表
   * @param commit
   * @param cb
   */
  getList({commit},cb){
    tool.request('city_list',{}).then((data)=>{
      commit('updateList',data)
      cb && cb(data)
    })
  },
  /**
   * 改变当前的城市
   * @param commit
   * @param cb
   */
  changeCurrentCity({commit},city){
    var rs = {
      province:'',
      city: city,
      gps: false
    }
    if(typeof(AMap)!='undefined') {
      var geocoder = new AMap.Geocoder({
        city: city,
        radius: 1000
      });
      geocoder.getLocation(city, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          var addr = result.geocodes[0].addressComponent
          rs.province = addr.province ? addr.province : '';
          rs.city = addr.city ? addr.city : rs.city;
        }
        commit('updateCurrent', rs)
      });
    }else{
      commit('updateCurrent', rs)
    }
  }
}

export default {
  namespaced: true, //开启命名空间，避免不同module下的actions和mutations重名
  state,
  mutations,
  actions
}
