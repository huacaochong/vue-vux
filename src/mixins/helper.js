import { mapState, mapActions } from 'vuex'
export default {
  computed:{

  },
  methods: {
     ...mapActions({
          showLoading: "vux/showLoading",
          hideLoading: "vux/hideLoading",
          showToast:"vux/showToast"
      }),
    linkTo (url) {
      if(!url) return false
      if(/^http/.test(url)){
        window.location.href = url
      }else{
        this.$router.push(url)
      }
    },
    replaceTo (url) {
          if(!url) return false
          if(/^http/.test(url)){
              window.location.replace(url)
          }else{
              this.$router.replace(url)
          }
    },
    isRestDay(){
          var day = this.$moment().day()
          if(day==0 || day==6){
              return true
          }
          return false
    },
    isRestTime(){
        if(this.isRestDay()) return true
        var hour =  this.$moment().hour()
        if(hour<9 || hour>15){
            return true
        }
        return false
    },
    alert(title,msg,cb) {
          var alert = {
              show: true,
              title: title,
              content: msg,
              onHide: () => {
                  cb && cb()
              }
          }
          this.$store.commit('vux/updateAlert', {alert})
    }
  },
  data () {
    return {

    }
  }
}
