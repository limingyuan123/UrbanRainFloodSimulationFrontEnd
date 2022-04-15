<!-- Couple组件 -->
<template>
  <div class="couple">
      <div class="navbar">
        <navbar></navbar>
      </div>
      <div class="mapContainer">
        <swmm></swmm>
      </div>
  </div>
</template>

<script>
import LeftMenu from '../components/LeftMenu'
import Navbar  from '../components/Navbar'
import Lisflood from '../components/LISFLOOD-FP'
import Swmm from '../components/SWMM'
export default {
  name:'Couple',
  components: {
    Navbar,
    Swmm,
    Lisflood,
    LeftMenu,
  },

  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
