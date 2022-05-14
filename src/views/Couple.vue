<!-- Couple组件 -->
<template>
  <div class="couple">
    <div class="navbar">
      <navbar></navbar>
    </div>
    <div class="mapContainer">
      <!-- <swmm></swmm> -->
      <!-- <swmm></swmm> -->
      <Lisflood></Lisflood>
    </div>
  </div>
</template>

<script setup>
import LeftMenu from "../components/LeftMenu";
import Navbar from "../components/Navbar";
import Lisflood from "../components/LISFLOOD-FP";
import Swmm from "../components/SWMM";
</script>

<style scoped>
</style>
