<style scoped> 
@import "../assets/css/home.css";
</style>
<template>
  <div id="container">
    <div class="navbar">
        <navbar></navbar>
    </div>
    <!-- head部分，展示标题 -->
    <header class="headerContainer">
      <div class="titleContainer">
        <h2 class="docs-header">城市雨洪模拟平台</h2>
      </div>
    </header>
    <!-- 介绍部分的菜单 -->
    <div class="left_menu" id="left_menu">
      <li class="liContainer">
        <strong class="menuFont">功能菜单</strong>
      </li>
      <li class="liContainer active">
        <a href="#" class="menuFont" @click="active($event)">Welcome</a>
      </li>
      <li class="liContainer">
        <a href="#" class="menuFont" @click="active($event)">Describe</a>
      </li>
      <li class="liContainer">
        <a href="#" class="menuFont" @click="active($event)">Mapping</a>
      </li>
      <li class="liContainer">
        <a href="#" class="menuFont" @click="active($event)">Refactor</a>
      </li>
      <li class="liContainer">
        <a href="#" class="menuFont" @click="active($event)">UDX Show</a>
      </li>
      <li class="liContainer">
        <a href="#" class="menuFont" @click="active($event)">Operation</a>
      </li>
    </div>
    <!-- 右侧的介绍内容 -->
    <div class="right_menu">
      <h2 style="font-size:40px;font-weight:bold">Getting Started</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also:
      </h3>
      <h2 style="font-size:30px">Welcome</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also: Are you listening to your customers?
        As they say: You cannot improve what you cannot measure; but the paradox
        is you cannot measure everything – happiness, hatred, anger… but you can
        measure customer satisfaction. Yes, you can measure customer
        satisfaction by analyzing likes and dislikes of your customers. You can
        gauge popularity of your website or products. You can also:
      </h3>
      <h2 style="font-size:30px">Describe</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also: Are you listening to your customers?
        As they say: You cannot improve what you cannot measure; but the paradox
        is you cannot measure everything – happiness, hatred, anger… but you can
        measure customer satisfaction. Yes, you can measure customer
        satisfaction by analyzing likes and dislikes of your customers. You can
        gauge popularity of your website or products. You can also: Are you
        listening to your customers? As they say: You cannot improve what you
        cannot measure; but the paradox is you cannot measure everything –
        happiness, hatred, anger… but you can measure customer satisfaction.
        Yes, you can measure customer satisfaction by analyzing likes and
        dislikes of your customers. You can gauge popularity of your website or
        products. You can also:
      </h3>
      <h2 style="font-size:30px">Mapping</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also: Yes, you can measure customer
        satisfaction by analyzing likes and dislikes of your customers. You can
        gauge popularity of your website or products. You can also:
      </h3>
      <h2 style="font-size:30px">Refactor</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction.
      </h3>
      <h2 style="font-size:40px;font-weight:bold">Link</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also: Are you listening to your customers?
        As they say: You cannot improve what you cannot measure; but the paradox
        is you cannot measure everything – happiness, hatred, anger… but you can
        measure customer satisfaction.
      </h3>
      <h2 style="font-size:30px">UDX Show</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also: satisfaction. Yes, you can measure
        customer satisfaction by analyzing likes and dislikes of your customers.
        You can gauge popularity of your website or products. You can also:
      </h3>
      <h2 style="font-size:30px">Operation</h2>
      <h3 style="line-height:30px">
        Are you listening to your customers? As they say: You cannot improve
        what you cannot measure; but the paradox is you cannot measure
        everything – happiness, hatred, anger… but you can measure customer
        satisfaction. Yes, you can measure customer satisfaction by analyzing
        likes and dislikes of your customers. You can gauge popularity of your
        website or products. You can also:  
      </h3>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import Navbar  from '../components/Navbar';
let activeNavIndex = ref("1");
const active = (event) => {
  console.log(event);
  let text = event.path[1].innerText;
  if (text === "Welcome") {
    unactive();
    let ele = document.getElementById("m2");
    ele.setAttribute("class", "active");
  } else if (text === "Describe") {
    unactive();
    let ele = document.getElementById("m3");
    ele.setAttribute("class", "active");
  } else if (text === "Mapping") {
    unactive();
    let ele = document.getElementById("m4");
    ele.setAttribute("class", "active");
  } else if (text === "Refactor") {
    unactive();
    let ele = document.getElementById("m5");
    ele.setAttribute("class", "active");
  } else if (text === "UDX Show") {
    unactive();
    let ele = document.getElementById("m7");
    ele.setAttribute("class", "active");
  } else if (text === "Operation") {
    unactive();
    let ele = document.getElementById("m8");
    ele.setAttribute("class", "active");
  }
};
const unactive = () => {
  let ele = document.getElementById("m2");
  ele.setAttribute("class", "unactive");
  ele = document.getElementById("m3");
  ele.setAttribute("class", "unactive");
  ele = document.getElementById("m4");
  ele.setAttribute("class", "unactive");
  ele = document.getElementById("m5");
  ele.setAttribute("class", "unactive");
  ele = document.getElementById("m7");
  ele.setAttribute("class", "unactive");
  ele = document.getElementById("m8");
  ele.setAttribute("class", "unactive");
}
onMounted(() => {
  //监听scroll事件,实现手写的sticky效果
  window.addEventListener("scroll", () => {
    var left_menu = document.getElementById("left_menu");
    var right_menu = document.getElementById("right_menu");
    if (right_menu.getBoundingClientRect().top <= 110) {
      left_menu.style.position = "fixed";
    } else if (right_menu.getBoundingClientRect().top > 110) {
      left_menu.style.position = "relative";
    }
  });

  window.addEventListener("", ()=>{

  })
})
</script>