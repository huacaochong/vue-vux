const host = "http://106.14.145.246/server.php/api/v1/"
export default {
  title: "project title",
  desc:  "project desc",
  link:  "http://a.com/wechat/auth", //分享链接
  imgUrl: "http://a.com/img/logo.png", //分享logo
  imgLink:"http://510jd.oss-cn-shanghai.aliyuncs.com",//图片预览前缀
  apiHost: "http://106.14.145.246/server.php/api/v1/",
  api: {
    home: "common/main",
    login: "common/wxlogin",
    hot_city: "common/city",
    city_list: "common/region"
  }
}
