<template>
  <div>
    <!-- menu -->
    <img
      src="images/OGMS.png"
      id="logo"
      class="pic"
      style="cursor:pointer;"
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
        <el-menu-item index="1" style="margin-left:20%" @click="turnToHome"
          >Home</el-menu-item
        >
        <el-menu-item index="2" @click="turnToProject"
          >Project</el-menu-item
        >
        <el-menu-item index="3" @click="turnToService"
          >Service</el-menu-item
        >
        <el-menu-item index="4" @click="turnToTemplate"
          >Code Template</el-menu-item
        >
        <el-menu-item index="5" @click="turnToHelp"
          >Help</el-menu-item
        >
        <!-- <el-submenu index="4">
          <template slot="title">My workspace</template>
          <el-menu-item index="4-1">option1</el-menu-item>
          <el-menu-item index="4-2">option2</el-menu-item>
          <el-menu-item index="4-3">option3</el-menu-item>
        </el-submenu> -->
        <el-menu-item index="6"
          ><a href="http://opengmsteam.com/" target="_blank"
            >About us</a
          ></el-menu-item
        >
        <el-menu-item index="7" style="margin-left: 25%;">
          <span @click="turnToLogin">Login</span>
        </el-menu-item>
        <el-menu-item index="8">
          <span @click="turnToSign">Sign up</span>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
    <!-- end -->
    <div id="footer" class="fixed-bottom">
      <footer data-v-0ef2f3f6="" style="backgroud:#135571;">
        <h2 data-v-0ef2f3f6="" class="footerTop" style="margin-bottom: 0px;">
          <i data-v-0ef2f3f6="" style="font-size:initial"
            >Open Geographic Modeling and Simulation</i
          >
        </h2>
        <p data-v-0ef2f3f6="" class="footerBottom" style="margin-top: 1px;">
          Copyright © 2013-2022 OpenGMS. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isCollapse: false,
      activeNavIndex: "",
    };
  },
  computed: {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    turnToHome() {
      this.$router.replace("/home");
    },
    turnToLogin() {
      this.$router.replace("/login");
    },
    turnToSign() {
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
    }
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
