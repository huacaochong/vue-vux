import mock from 'mockjs'

export default {
  install (Vue) {
    Vue.prototype.$mock = mock
    Vue.mock = mock
    console.log(mock);
  },
  $mock: mock
}
