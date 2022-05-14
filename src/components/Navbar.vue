<template>
  <div>
    <!-- menu -->
    <img
      src="images/OGMS.png"
      id="logo"
      class="pic"
      style="cursor:pointer;"
      @click="toHome"
    />
    <!-- header -->
    <div>
      <el-menu
        :default-active="activeNavIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#135571"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1" style="margin-left:20%" @click="toHome"
          >主页</el-menu-item
        >
        <el-menu-item index="2" @click="toOperation"
          >操作</el-menu-item
        >
        <el-menu-item index="3" @click="toShow"
          >展示</el-menu-item
        >
        <el-menu-item index="4" @click="turnToHelp"
          >帮助</el-menu-item
        >
        <el-menu-item index="5"
          ><a href="http://opengmsteam.com/" target="_blank"
            >关于我们</a
          ></el-menu-item
        >
        <el-menu-item v-show="!this.$store.state.Authorization" index="7" style="margin-left: 40%;">
          <span @click="turnToLogin">Login</span>
        </el-menu-item>
        <el-menu-item v-show="!this.$store.state.Authorization" index="8">
          <span @click="turnToSign">Sign up</span>
        </el-menu-item>
      </el-menu>

      <div  v-show="this.$store.state.Authorization" style="right:40px;position: absolute;z-index: 10;top: 10px;display:flex">
        <el-dropdown>
          <div style="flex:1">
              <el-avatar src=
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
              </el-avatar>
              <el-icon class="el-icon--right" style="color: white;position: absolute;
    top: 15px;">
                <arrow-down />
              </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span>当前登录账号：</span>
                 <el-divider />
                <span style="">{{this.$store.state.userName}}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="toHome">Home</el-dropdown-item>
              <el-dropdown-item @click="toOperation">Operation</el-dropdown-item>
              <el-dropdown-item @click="logOut">登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div id="footer" class="fixed-bottom" style="z-index: 100;height: 60px;">
      <footer data-v-0ef2f3f6="" style="background-color:#135571;">
        <h2 data-v-0ef2f3f6="" class="footerTop" style="margin-bottom: 0px;">
          <i data-v-0ef2f3f6="" style="font-size:initial">
            Open Geographic Modeling and Simulation</i>
        </h2>
        <p data-v-0ef2f3f6="" class="footerBottom" style="margin-top: 1px;">
          Copyright © 2013-2022 OpenGMS. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
    <router-view></router-view>
    <!-- end -->
    
</template>

<script setup>
import {useStore} from 'vuex'
import { ArrowDown } from '@element-plus/icons-vue'
import {onMounted, ref, toRef} from 'vue';
import {  useRouter} from 'vue-router'
const router = useRouter();
const store = useStore();
let activeNavIndex = ref("1");
const handleOpen = (key, keyPath)  => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath)  => {
  console.log(key, keyPath);
};
const handleSelect = (key, keyPath)  => {
  console.log(key, keyPath);
};
const toHome = ()  => {
  store.commit('setIndex', '1');   
  router.push('/home')
};
const turnToLogin = ()  => {
  store.commit('setIndex', '');
  router.push('/login')
};
const turnToSign = ()  => {
  store.commit('setIndex', '');
  router.push('/register')
};
const turnToTemplate = ()  => {
  router.push('/template')
};
const turnToService = () => {
  router.push('/service')
};
const turnToProject = () => {
  router.push('/project')
};
const turnToHelp = () => {
  alert("hello im help sir");
};
const toOperation = () => {      
  store.commit('setIndex', '2');
  router.push('/operation')
};
const toShow = () => {
  store.commit('setIndex', '3');
  router.push('/couple')
};
const logOut = () => {
  store.commit('setLogin', {Authorization:'', userName:''});
}
onMounted(() => {
  activeNavIndex.value = store.state.index;
})
</script>
<style>
  
#logo {
    position: absolute;
    width: 129px;
    height: 40px;
    z-index: 1;
    margin-top: 7px;
    /* margin-left: 2.5%; */
    cursor: pointer;
    left: 50px;
  }
  #subcard {
    width: 280px;
    height: 100%;
    position: fixed;
    z-index: 2;
  }
  footer[data-v-0ef2f3f6] {
    background-color: #135571;
    height: 60px;
    width: 100%;
    bottom: 0;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }
  .footerTop[data-v-0ef2f3f6] {
    text-align: center;
    color: white;
    font-weight: bold;
    margin-top: 10px;
  }
  .footerBottom[data-v-0ef2f3f6] {
    text-align: center;
    color: white;
    font-size: 0.8em;
  }
  body {
    margin: 0px;
  }
  #footer{
      width: 100%;
       /* footer的高度一定要是固定值*/ 
      /* height:60px;   */
      bottom:0px;
      left:0px;
      position: fixed;
  }
</style>
