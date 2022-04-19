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
          >Home</el-menu-item
        >
        <el-menu-item index="2" @click="toOperation"
          >Operation</el-menu-item
        >
        <el-menu-item index="3" @click="toShow"
          >Show</el-menu-item
        >
        <el-menu-item index="4" @click="turnToHelp"
          >Help</el-menu-item
        >
        <el-menu-item index="5"
          ><a href="http://opengmsteam.com/" target="_blank"
            >About us</a
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
    <router-view></router-view>
    <!-- end -->
    <div id="footer" class="fixed-bottom">
      <footer data-v-0ef2f3f6="" style="backgroud:#135571;">
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
</template>

<script>
import {mapMutations} from 'vuex'
import { ArrowDown } from '@element-plus/icons-vue'
export default {
  name: "Navbar",
  components:{
    ArrowDown,
  },
  data() {
    return {
      isCollapse: false,
      activeNavIndex: "1",
      userName:'',
    };
  },
  computed: {},
  methods: {    
    ...mapMutations(['setLogin', 'setIndex']),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    toHome() {
      // this.activeNavIndex = '1';
      this.setIndex('1');
      this.$router.replace("/home");
    },
    turnToLogin() {
      this.setIndex('');
      this.$router.replace("/login");
    },
    turnToSign() {
      this.setIndex('');
      this.$router.replace("/register");
    },
    turnToTemplate() {
      this.$router.replace("/template");
    },
    turnToService(){
      this.$router.replace("/service");
    },
    turnToProject(){
      this.$router.replace("/project");
    },
    turnToHelp(){
      alert("hello im help sir");
    },
    toOperation(){
      // this.activeNavIndex = '2';
      
      this.setIndex('2');
      this.$router.replace("/operation");
    },
    toShow(){
      // this.activeNavIndex = '3';
      this.setIndex('3');
      this.$router.replace("/couple");
    },
    logOut(){
      this.setLogin({Authorization:'', userName:''});
    }
  },
  mounted(){
    this.activeNavIndex = this.$store.state.index;
  }
};
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
