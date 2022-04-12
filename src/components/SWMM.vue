<!-- mapbox -->
<template>
  <div class="tool">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="card"
      style="height: 100%"
      stretch
    >
      <el-tab-pane label="管网图" name="first">
        <!-- File -->
        <div class="detail">
          <!-- <p>You can perform a series of file operations, including loading project files, importing configuration files, and saving result files</p> -->
          <p>选择不同的降水类型，展示不同的模拟结果</p>
        </div>
        <el-button
          class="file"
          style="background: #d4d7d8; margin: 5px"
          @click="openFileDialog()"
        >
          <h2 style="margin: 5px">五年一遇降水</h2>
          <p>选择该降水数据，展示模拟结果</p>
        </el-button>
        <el-button
          class="file"
          style="background: #d4d7d8; margin: 5px"
          @click="loadDispRes(tenNow)"
        >
          <h2 style="margin: 5px">十年一遇降水</h2>
          <p>选择该降水数据，展示模拟结果</p>
        </el-button>
        <el-button
          class="file"
          style="background: #d4d7d8; margin: 5px"
          @click="loadFenhuLayer(0, '20year', 0)"
        >
          <h2 style="margin: 5px">二十年一遇降水</h2>
          <p>选择该降水数据，展示模拟结果</p>
        </el-button>
        <el-button
          class="file"
          style="background: #d4d7d8; margin: 5px"
          @click="loadFenhuLayer(0, '30year', 0)"
        >
          <h2 style="margin: 5px">三十年一遇降水</h2>
          <p>选择该降水数据，展示模拟结果</p>
        </el-button>
        <el-button
          class="file"
          style="background: #d4d7d8; margin: 5px"
          @click="loadFenhuLayer(0, '50year', 0)"
        >
          <h2 style="margin: 5px">五十年一遇降水</h2>
          <p>选择该降水数据，展示模拟结果</p>
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="流向图" name="second">Operation</el-tab-pane>
      <!-- <el-tab-pane label="Simulation" name="third">Simulation</el-tab-pane>
        <el-tab-pane label="Coupling analysis" name="fourth">Coupling analysis</el-tab-pane> -->
    </el-tabs>
  </div>
  <div id="map"></div>
  <div id="time-slider">
    <el-slider
      v-model="timeSlider"
      @change="sliderChange"
      :step="1"
      :min="1"
      :max="maxSlider"
      :marks="marks"
      :format-tooltip="formatTooltip"
      style="width: 80%; margin: auto"
    >
    </el-slider>
    <el-button
      size="small"
      round
      @click="startAnimation"
      :disabled="startBtn"
      style="margin-bottom: 5px"
      >Start</el-button>
    <el-button size="small" round @click="pauseAnimation" :disabled="pauseBtn">Pause</el-button>
  </div>
</template>

<script>
//样式引入
import "mapbox-gl/dist/mapbox-gl.css";
//定义变量使用
const mapboxgl = require("mapbox-gl");
export default {
  name: "SWMM",
  data() {
    return {
      isCollapse: true,
      fileDialog: false,
      loading: false,
      uploadFiles: [],
      geojson: "",
      geojsonLayer: Object,
      viewer: Object,
      fileList: [],
      swmmVisualDialog: false,
      echartsDialog: false,
      activeName: "first",
      dispArr: [],
      dispJSON: {},
/*      date: [],*/
      timeSlider: 0,
      maxSlider: 10,
      marks: {},
      startBtn: true,
      pauseBtn: true,
      date: [
        
      ],
      intevalAnima: null,
      curDateIndex: 0,
      curYear: "5year",
    };
  },
  components: {},
  created() {},
  mounted() {
    this.initmap();
  },
  computed: {},
  methods: {
    initmap() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoibGltaW5neXVhbiIsImEiOiJjbDFvZXQ0dDcxM3VlM2JvYjB5Nnp0b2ZmIn0.m-HbmTaL15VUII9cyDNzpg";
      var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [120.845998, 31.037172],
        zoom: 15,
      });

      //注册点击事件
      map.on("click", function (e) {
        console.log("点击");
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    openFileDialog() {
      this.uploadFiles = [];
      //   this.$refs['upload'].clearFiles();
      this.fileList = [];
      this.fileDialog = true;
    },
    handleClick() {},
    confirmLoad() {},
    selectFile() {
      $("#uploadFile").click();
    },
    uploadChange(file, fileList) {
      this.uploadFiles = fileList;
    },
    setView() {},
    //将展示的geojson加载入cesium
    addGeoJson(json) {},
    changeEcharts(dispResult) {},
    //加载第几幅图层
    //加载第几年的第几幅图层
    loadFenhuLayer(flag, year, reload) {},
    //时间线变动函数
    sliderChange(val) {
      this.loadFenhuLayer(val, this.year);
      this.curDateIndex = val;
    },
    formatTooltip(val) {},
    changeResult(e){
      
    },
    startAnimation() {
      this.startBtn = true;
      this.pauseBtn = false;
    },
    pauseAnimation() {
      //btn
      // this.selectBtn = false
      this.startBtn = false;
      this.pauseBtn = true;

      clearInterval(this.intevalAnima);
    },
    addLayer() {},
  },
};
</script>

<style>
#map {
  height: calc(100vh - 120px);
}
/* .tool {
  position: absolute;
  top: 40%;
  z-index: 10000;
  left: 0%;
} */
.tool {
  background: white;
  height: calc(100vh - 120px);
  width: 30%;
  position: absolute;
  /* top: 40%; */
  z-index: 1000;
  left: 0%;
}
#time-slider {
  text-align: center;
  z-index: 10000;
  position: absolute;
  bottom: 70px;
  width: 30%;
}
#test{
  position: inherit;
}
</style>
