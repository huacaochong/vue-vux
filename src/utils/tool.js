import Vue from 'vue'
import md5 from 'md5'
import { router, store } from '@/main.js'
import Config from '@/Config'

export default {
    request(api_name, params, method) {
        if(this.getCookie("saveUserInfo")!="" &&!this.getCookie("saveUserInfo")){
            router.push('/login')
            return
        }
        if (typeof (Config.api[api_name]) == 'undefined') {
            this.alertError('接口' + api_name + '未定义');
            return false;
        }
        var api_url = Config.apiHost + Config.api[api_name]
        //sign
        params = this.sign(params)
        var unauth = ['login', 'home', 'register', 'code', 'forget']
        if (unauth.indexOf(api_name) == -1) {
            //token
            params = this.token(params)
        }
        if (!method) {
            method = 'get'
        }
        method = method.toLowerCase()
        switch (method) {
            case 'post':
                return new Promise((resolve, reject) => {
                    Vue.http.post(api_url, params)
                        .then(res => {
                            if (res.data.code == 1) {
                                resolve(res.data.data);
                            } else {
                                this.alertError(res.data.msg);
                                reject(res.data.msg);
                            }
                        })
                        .catch(error => {
                            this.alertError('无法连接到服务器');
                            reject(error);
                        })
                })
            default:
                return new Promise((resolve, reject) => {
                    Vue.http.get(api_url, { params })
                        .then(res => {
                            if (res.data.code == 1) {
                                resolve(res.data.data);
                            } else {
                                this.alertError(res.data.msg);
                                reject(res.data.msg);
                            }
                        })
                        .catch(error => {
                            this.alertError('无法连接到服务器');
                            reject(error);
                        })
                })
        }
    },
    sign(params) {
        var date = new Date().getTime()
        var device_id = '0b89de3f-679b57e5-0bd85a7a-90cc57d1'
        var sign = md5(md5(String(date)) + 'cpic201711' + device_id)
        params.device = device_id
        params.timestamp = date
        params.sign = sign
        return params
    },
    token(params){
      params.token = this.getStorage('token', '')
      return params
    },
    upload(file) {
        var api_url = Config.apiHost + Config.api['upload']
        var formData = new FormData()
        formData.append('img', file);
        //sign
        // var date = new Date().getTime()
        // var device_id = this.getStorage('open_id', '')
        // var sign = md5(md5(String(date)) + Config.only_id + device_id)
        formData.append('token', this.getStorage('token', ''));
        // formData.append('device', device_id);
        // formData.append('timestamp', date);
        // formData.append('sign', sign);
        var config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        return new Promise((resolve, reject) => {
            Vue.http.post(api_url, formData, config)
                .then(res => {
                    if (res.data.code == 1) {
                        resolve(res.data.data);
                    } else {
                        this.alertError(res.data.msg);
                        reject(res.data.msg);
                    }
                })
                .catch(error => {
                    this.alertError('无法连接到服务器');
                    reject(error);
                })
        })
    },
    getStorage(name, val) {
        var v = localStorage.getItem(name), w
        if (v == null) {
            return val
        }
        if (typeof v == 'string') {
            try {
                w = JSON.parse(v)
                if (typeof (w) == 'object') {
                    return w
                } else {
                    return v
                }
            } catch (e) {
                return v
            }
        }
    },
    setStorage(name, data, source) {
        if (typeof (data) == 'object') {
            if (typeof (source) == 'undefined') {
                source = {}
            }
            for (var key in data) {
                source[key] = data[key]
                if (typeof (data[key]) == 'object') {
                    localStorage.setItem(name + "_" + key, JSON.stringify(data[key]))
                } else {
                    localStorage.setItem(name + "_" + key, data[key])
                }
            }
        } else {
            source = data
            localStorage.setItem(name, data)
        }
        return source
    },
    alertError(msg, fb) {
        if (msg == 'token不能为空') {
            if (['', '/login', '/register'].indexOf(store.state.route.path) == -1) {
                this.setStorage('login_jump', store.state.route.path)
            }
            router.replace('/login')
            return false
        }
        var alert = {
            show: true,
            title: '错误',
            content: msg,
            onShow: () => {
            },
            onHide: () => {
                if (msg == '登录过期') {
                    if (['', '/login', '/register'].indexOf(store.state.route.path) == -1) {
                        this.setStorage('login_jump', store.state.route.path)
                    }
                    router.replace('/login')
                    return false
                }
                fb && fb()
            },
        }
        store.dispatch('vux/hideLoading')
        store.commit('vux/updateAlert', { alert })
    },
    getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
          var arr = arrCookie[i].split("=");
          if (cookieName == arr[0]) {
            return arr[1];
          }
        }
        return "";
    },
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/"
    },
    clearCookie(name) {
        this.setCookie(name, "", -1);
    }
}
