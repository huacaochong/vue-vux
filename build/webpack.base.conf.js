'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vuxLoader = require('vux-loader')
const vueLoaderConfig = require('./vue-loader.conf')
const fs = require('fs')
const pagesPath = path.resolve(__dirname, '../src/pages.json')
const vConsolePlugin = require('vconsole-webpack-plugin')

function toDash(str) {
  return str.replace(/([A-Z])/g, function (m, w) {
      return '-' + w.toLowerCase();
  }).replace('-', '')
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [
      '.js', '.vue', '.json','.less'
    ],
    plugins: [new vConsolePlugin({
      enable: true // 发布代码前记得改回 false
    })],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader",
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules that does not
    // make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    {
      name: 'less-theme',
      path: 'src/assets/less/theme.less'
    },
    {
      // 替换页面路由
      name: 'js-parser',
      test: /main\.js/,
      fn: function (source) {
        let list = fs.readFileSync(pagesPath, 'utf-8')
        list = JSON.parse(list)
        let str = []
        for (var page in list) {
          let filename = page
          let path = `/${toDash(page)}`
          if (/#/.test(page)) {
            filename = page.split('#')[0]
            path = page.split('#')[1]
          }
          str.push(`{
            path: '${path}',
            meta: {title: '${list[page]}'},
            component: function (resolve) {
            require(['./pages/${filename}.vue'], resolve)
            }
          }`)
        }
        // 404 page
        str.push(`{
          path: '*',
          component: function (resolve) {
          require(['./components/NotFoundComponent.vue'], resolve)
          }
        }`)
        str = `[${str.join(',\n')}]`
        source = source.replace('let routes = []', 'let routes = ' + str)
        return source
      }
    }
  ]
})
