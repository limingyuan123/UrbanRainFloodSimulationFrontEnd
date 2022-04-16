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
      >Start</el-button
    >
    <el-button size="small" round @click="pauseAnimation" :disabled="pauseBtn"
      >Pause</el-button
    >
  </div>
</template>

<script>
//样式引入
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl";
import { toRaw } from "@vue/reactivity";
//定义变量使用
const mapboxgl = require("mapbox-gl");
export default {
  name: "SWMM",
  data() {
    return {
      rptResult: {},
      isCollapse: true,
      fileDialog: false,
      loading: false,
      uploadFiles: [],
      propertySelectVisible: false,
      nodeRadio: 1,
      linkRadio: 2,
      selData: [],
      selTitle: "",
      geojson: "",
      geojsonObject: {},
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
      timeSliderMap: true,
      layerNumber: 0,
      nodemin: 0,
      nodemax: 0,
      nodestep: 1,
      linkmin: 0,
      linkmax: 0,
      linkstep: 1,
      maxSlider: 10,
      marks: {},
      map: {},
      numberAnima: 0,
      nodeResultArr: [],
      options: [
        {
          value: "node",
          label: "Node Results",
          children: [],
        },
        {
          value: "link",
          label: "Link Results",
          children: [],
        },
      ],
      linkResultArr: [],
      startBtn: true,
      pauseBtn: true,
      date: [],
      intevalAnima: null,
      curDateIndex: 0,
      curYear: "5year",
      conduitStartBtn: true,
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
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [120.845998, 31.037172],
        zoom: 15,
      });
      //注册点击事件
      this.map.on("click", function (e) {
        console.log("点击");
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getrptResult() {
      return new Promise((resolve, reject) => {
        this.axios
          .get("/quo_5.disp")
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getGeojson() {
      return new Promise((resolve, reject) => {
        this.axios
          .get("/quo2.geojson")
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    openFileDialog() {
      let f = this.getrptResult();
      let ff = this.getGeojson();
      Promise.all([f, ff]).then((array) => {
        this.rptResult = array[0];
        this.geojsonObject = array[1];
        console.log(this.geojsonObject.features[1].properties['value']);
        console.log(this.geojsonObject.features[1].properties.name);
        console.log(this.geojsonObject.features
        );
        this.options = [
          {
            value: "node",
            label: "Node Results",
            children: [],
          },
          {
            value: "link",
            label: "Link Results",
            children: [],
          },
        ];
        // chart Tab
        for (let i = 0; i < this.rptResult.Node.length; i++) {
          var node = this.rptResult.Node[i];
          var nodeResult = this.rptResult.NodeResults[i];
          var child = {
            value: node.toLowerCase(),
            label: node,
            children: [
              {
                value: "Inflow",
                label: "入流量(m³/s)",
                data: nodeResult.Inflow,
              },
              {
                value: "Flooding",
                label: "管点溢流(m³/s)",
                data: nodeResult.Flooding,
              },
              {
                value: "Depth",
                label: "管点深度(m)",
                data: nodeResult.Depth,
              },
              {
                value: "Head",
                label: "管点水头(m)",
                data: nodeResult.Head,
              },
            ],
          };
          this.options[0].children.push(child);
        }
        for (let j = 0; j < this.rptResult.Link.length; j++) {
          var link = this.rptResult.Link[j];
          var linkResult = this.rptResult.LinkResults[j];
          var child = {
            value: link.toLowerCase(),
            label: link,
            children: [
              {
                value: "Flow",
                label: "管道流量(m³/s)",
                data: linkResult.Flow,
              },
              {
                value: "Velocity",
                label: "水流速度(m/s)",
                data: linkResult.Velocity,
              },
              {
                value: "Depth",
                label: "管道水深(m)",
                data: linkResult.Depth,
              },
              {
                value: "Capacity",
                label: "管道容量",
                data: linkResult.Capacity,
              },
            ],
          };
          this.options[1].children.push(child);
        }
        this.map.addSource("source-id" + this.layerNumber, {
          type: "geojson",
          data: this.geojsonObject,
        });
        let ll = 1;
        this.map.addLayer({
          id: "vectorLayer" + this.layerNumber + "poly",
          type: "fill",
          source: "source-id" + this.layerNumber,

          paint: {
            "fill-color": "#000000",
            "fill-opacity": 0.1,
          },
          filters: ["in", "type", "MultiPolygon"],
        });
        this.map.addLayer({
          id: "vectorLayer" + this.layerNumber + "line",
          type: "line",
          source: "source-id" + this.layerNumber,
          filters: ["in", "type", "MultiLineString"],
        });
        this.map.addLayer({
          id: "vectorLayer" + this.layerNumber + "point",
          type: "circle",
          source: "source-id" + this.layerNumber,
          paint: {
            "circle-color": [
              "case",
              ["<", ["get", "value"], this.nodemin],
              "#ffffff", //<10.8
              ["<", ["get", "value"], this.nodemin + ll * this.nodestep],
              "#fdd519", //>=10.8 & <17.2
              ["<", ["get", "value"], this.nodemin + (ll + 1) * this.nodestep],
              "#f8a114",
              ["<", ["get", "value"], this.nodemin + (ll + 2) * this.nodestep],
              "#f36f0f",
              ["<=", ["get", "value"], this.nodemin + (ll + 3) * this.nodestep],
              "#ee430b",
              ["<=", ["get", "value"], this.nodemin + (ll + 4) * this.nodestep],
              "#e90806", //>=41.5 & <50.1
              "#e90806", // 默认值, >=50.1
            ],
          },
          filters: ["in", "type", "Point"],
        });
        var that = this;
        this.map.on(
          "mouseenter",
          "vectorLayer" + this.layerNumber + "point",
          function () {
            that.map.getCanvas().style.cursor = "pointer";
          }
        );
        this.map.on(
          "mouseleave",
          "vectorLayer" + this.layerNumber + "point",
          function () {
            that.map.getCanvas().style.cursor = "";
          }
        );
        this.map.on(
          "mouseenter",
          "vectorLayer" + this.layerNumber + "line",
          function () {
            that.map.getCanvas().style.cursor = "pointer";
          }
        );
        this.map.on(
          "mouseleave",
          "vectorLayer" + this.layerNumber + "line",
          function () {
            that.map.getCanvas().style.cursor = "";
          }
        );
        // this.map.on(
        //   "mouseenter",
        //   "vectorLayer" + this.layerNumber + "poly",
        //   function () {
        //     that.map.getCanvas().style.cursor = "pointer";
        //   }
        // );
        // this.map.on(
        //   "mouseleave",
        //   "vectorLayer" + this.layerNumber + "poly",
        //   (e) => {
        //     that.map.getCanvas().style.cursor = "";
        //   }
        // );
        this.layerNumber++;
        this.changeChooseMap();
        // slider
        this.timeSliderMap = false;
        this.maxSlider = this.rptResult.Date.length;
        this.marks = {
          1: this.formatTooltip(1),
        };

        // btn
        this.startBtn = false;
        this.conduitStartBtn = false;
      });

      // map Tab

      //conduit
    },
    changeChooseMap() {
      // 还原slider
      this.numberAnima = 32;
      this.timeSlider = 33;

      this.loading = true;
      this.propertySelectVisible = false;
      // 获取所有要素的选中属性
      this.nodeResultArr = [];
      this.linkResultArr = [];
      for (let i = 0; i < this.options[0].children.length; i++) {
        // node
        var node = this.options[0].children[i];
        var element = node.children[this.nodeRadio];
        this.nodeResultArr.push(element.data); // 汇总该属性的所有模拟值
      }
      for (let k = 0; k < this.rptResult.Node.length; k++) {
        // 更新geojsonObject
        var feat = this.geojsonObject.features[k];
        feat.properties.value = this.nodeResultArr[k][0];
      }
      for (let i = 0; i < this.options[1].children.length; i++) {
        // link
        var link = this.options[1].children[i];
        var element = link.children[this.linkRadio];
        this.linkResultArr.push(element.data);
      }
      for (let k = 0; k < this.rptResult.Link.length; k++) {
        // 更新geojsonObject
        var feat = this.geojsonObject.features[this.rptResult.Node.length + k];
        feat.properties.value = this.linkResultArr[k][0];
      }
      // 获取最大最小值
      if (this.nodeRadio == 0) {
        // node
        this.nodemin = this.rptResult.MaxMin.node.minInflow;
        this.nodemax = this.rptResult.MaxMin.node.maxInflow;

        let max = this.rptResult.MaxMin.node.maxInflow;
        this.nodestep = (this.nodemax - this.nodemin) / 5;
      } else if (this.nodeRadio == 1) {
        this.nodemin = this.rptResult.MaxMin.node.minFlooding;
        this.nodemax = this.rptResult.MaxMin.node.maxFlooding;
        this.nodestep = (this.nodemax - this.nodemin) / 5;
      } else if (this.nodeRadio == 2) {
        this.nodemin = this.rptResult.MaxMin.node.minDepth;
        this.nodemax = this.rptResult.MaxMin.node.maxDepth;
        this.nodestep = (this.nodemax - this.nodemin) / 5;
      } else if (this.nodeRadio == 3) {
        this.nodemin = this.rptResult.MaxMin.node.minHead;
        this.nodemax = this.rptResult.MaxMin.node.maxHead;
        this.nodestep = (this.nodemax - this.nodemin) / 5;
      }
      if (this.linkRadio == 0) {
        // link
        this.linkmin = this.rptResult.MaxMin.link.minFlow;
        this.linkmax = this.rptResult.MaxMin.link.maxFlow;
        this.linkstep = (this.linkmax - this.linkmin) / 5;
      } else if (this.linkRadio == 1) {
        this.linkmin = this.rptResult.MaxMin.link.minVelocity;
        this.linkmax = this.rptResult.MaxMin.link.maxVelocity;
        this.linkstep = (this.linkmax - this.linkmin) / 5;
      } else if (this.linkRadio == 2) {
        this.linkmin = this.rptResult.MaxMin.link.minDepth;
        this.linkmax = this.rptResult.MaxMin.link.maxDepth;
        this.linkstep = (this.linkmax - this.linkmin) / 5;
      } else if (this.linkRadio == 3) {
        this.linkmin = this.rptResult.MaxMin.link.minCapacity;
        this.linkmax = this.rptResult.MaxMin.link.maxCapacity;
        this.linkstep = (this.linkmax - this.linkmin) / 5;
      }
      this.map.setZoom(14);
      this.map.setCenter({ lng: 120.845, lat: 31.037 });
      this.sliderChange(33);
    },
    handleClick() {},
    confirmLoad() {},
    selectFile() {
      $("#uploadFile").click();
    },
    uploadChange(file, fileList) {
      this.uploadFiles = fileList;
    },
    //将展示的geojson加载入cesium
    addGeoJson(json) {},
    changeEcharts(dispResult) {},
    //加载第几幅图层
    //加载第几年的第几幅图层
    loadFenhuLayer(flag, year, reload) {},
    //时间线变动函数
    sliderChange(val) {
      this.numberAnima = val - 1;
      for (let i = 0; i < this.rptResult.Node.length; i++) {
        // 更新geojsonObject
        let feat = this.geojsonObject.features[i];
        feat.properties.value = this.nodeResultArr[i][this.numberAnima];
      }
      for (let k = 0; k < this.rptResult.Link.length; k++) {
        // 更新geojsonObject
        let feat = this.geojsonObject.features[this.rptResult.Node.length + k];
        feat.properties.value = this.linkResultArr[k][this.numberAnima];
      }
      // 更新openlayer
      // this.refreshOpenlayer();
    },
    refreshOpenlayer() {
      var feature = this.map.queryRenderedFeatures({
        layers: ["vectorLayer" + 0 + "point"],
      });
      for (let i = 0; i < this.rptResult.Node.length; i++) {
        // 更新geojsonObject
        let feat = this.geojsonObject.features[i];
        feature[i].properties.value = this.nodeResultArr[i][this.numberAnima];
      }
      let ll = 1;
      this.map.setPaintProperty("vectorLayer" + 0 + "point", "circle-color", [
        "case",
        ["<", ["get", "value"], this.nodemin],
        "#fdd519", //<10.8
        ["<", ["get", "value"], this.nodemin + ll * this.nodestep],
        "#fdd519", //>=10.8 & <17.2
        ["<", ["get", "value"], this.nodemin + (ll + 1) * this.nodestep],
        "#f8a114",
        ["<", ["get", "value"], this.nodemin + (ll + 2) * this.nodestep],
        "#f36f0f",
        ["<=", ["get", "value"], this.nodemin + (ll + 3) * this.nodestep],
        "#ee430b",
        ["<=", ["get", "value"], this.nodemin + (ll + 4) * this.nodestep],
        "#e90806", //>=41.5 & <50.1
        "#e90806", // 默认值, >=50.1
      ]);
    },
    formatTooltip(val) {
      if (this.rptResult.Date != undefined) {
        // MAY-01-2020  08:10:00
        // yyyy-MM-dd hh-mm-ss
        var month = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        var dateDay = this.rptResult.Date[val - 1].split(/ +/)[0];
        var dateSec = this.rptResult.Date[val - 1].split(/ +/)[1];
        var nyr = dateDay.split("-");
        var hms = dateSec.split(":");
        var dateStr = nyr[2] + "-" + nyr[1] + "-";
        for (let i = 0; i < month.length; i++) {
          if (month[i].toLowerCase().includes(nyr[0].toLowerCase())) {
            dateStr += ("0" + (i + 1)).slice(-2) + " " + hms.join("-");
          }
        }
        return dateStr;
      }
    },
    startAnimation() {
      this.startBtn = true;
      this.pauseBtn = false;
      this.intevalAnima = setInterval(() => {
        if (this.numberAnima == this.rptResult.Date.length) {
          this.numberAnima = 0;
          this.timeSlider = 1;
        }
        for (let i = 0; i < this.rptResult.Node.length; i++) {
          // 更新geojsonObject
          let feat = this.geojsonObject.features[i];
          this.geojsonObject.features[i].properties.value =
            this.nodeResultArr[i][this.numberAnima];
          // if(feat.properties.value!=0){
          //   console.log(i)
          // }
        }
        for (let k = 0; k < this.rptResult.Link.length; k++) {
          // 更新geojsonObject
          let feat =
            this.geojsonObject.features[this.rptResult.Node.length + k];
          this.geojsonObject.features[
            this.rptResult.Node.length + k
          ].properties.value = this.linkResultArr[k][this.numberAnima];
        }
        // 更新openlayer
        this.refreshOpenlayer();
        this.numberAnima++;
        this.timeSlider++;
      }, 1000);
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
#test {
  position: inherit;
}
</style>
