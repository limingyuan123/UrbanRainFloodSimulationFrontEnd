const webpack = require("webpack");
const path = require('path')

module.exports = {
    publicPath: './',
    assetsDir: './public',
    productionSourceMap: false,
    lintOnSave: false, //关闭ESLint代码检验
    devServer: {
      open: true, //run启动的时候是否弹出页面
      host: '0.0.0.0', //本机地址
      port: '8898', //端口号
      https: false,
      hotOnly: false,
      overlay:{
        warning:true,
        errors:true
      },
      proxy: {
        //配置跨域
        '/api': {
          target: 'http://localhost:8899',
          ws: true,
          timeout: 3600000,
          changOrigin: true,
          pathRewrite: {
            '^/api': '',
          }
        },
      } 
    },
    // configureWebpack:(config) => {
    //   let plugins = [];
    //   // if(process.env.NODE_ENV === 'production'){

    //   // }
    //   return {
    //     module:{
    //       unknownContextCritical:false,
    //       rules:[
    //         {
    //           test: /\.tsx?$/,
    //           loader: 'ts-loader',
    //           options: {
    //             appendTsSuffixTo: [/\.vue$/],
    //           },
    //           exclude: /node_modules/,
    //         },
    //         {
    //           test: /\.vue$/,
    //           loader: 'vue-loader',
    //         }
    //       ]
    //     }
    //   }
    // }
}