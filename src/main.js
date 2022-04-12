import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
import * as L from 'leaflet'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

createApp(App).use(store).use(router).use(ElementPlus).use(axios).mount('#app')