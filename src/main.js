import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
import * as L from 'leaflet'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
import $ from 'jquery';
import axios from 'axios'
import VueAxios from 'vue-axios'
window.jQuery = $;
window.$ = $;



createApp(App).use(store).use(router).use(ElementPlus).use(VueAxios, axios).mount('#app')