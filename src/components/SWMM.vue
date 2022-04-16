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
    getrptResult(e) {
      return new Promise((resolve, reject) => {
        e.axios
          .get("/quo_5.disp")
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getGeojson(e) {
      return new Promise((resolve, reject) => {
        e.axios
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
      let f = this.getrptResult(this);
      let ff = this.getGeojson(this);
      let _this = this;
      Promise.all([f, ff]).then((array) => {
        _this.rptResult = array[0];
        _this.geojsonObject = array[1];
        console.log(_this.geojsonObject.features[1].properties["value"]);
        console.log(_this.geojsonObject.features[1].properties.name);
        console.log(_this.geojsonObject.features);
        _this.options = [
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
        for (let i = 0; i < _this.rptResult.Node.length; i++) {
          let node = _this.rptResult.Node[i];
          let nodeResult = _this.rptResult.NodeResults[i];
          let child = {
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
          _this.options[0].children.push(child);
        }
        for (let j = 0; j < _this.rptResult.Link.length; j++) {
          let link = _this.rptResult.Link[j];
          let linkResult = _this.rptResult.LinkResults[j];
          let child = {
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
          _this.options[1].children.push(child);
        }
        _this.changeChooseMap(_this);
        _this.map.addSource("source-id" + _this.layerNumber, {
          type: "geojson",
          data: _this.geojsonObject,
        });
        let ll = 1;
        // _this.map.addLayer({
        //   id: "vectorLayer" + _this.layerNumber + "poly",
        //   type: "fill",
        //   source: "source-id" + _this.layerNumber,

        //   paint: {
        //     "fill-color": "#000000",
        //     "fill-opacity": 0.1,
        //   },
        //   filters: ["in", "type", "MultiPolygon"],
        // });
        _this.map.addLayer({
          id: "vectorLayer" + _this.layerNumber + "line",
          type: "line",
          source: "source-id" + _this.layerNumber,
          paint: {
            'line-width':3,
            "line-color": [
              "case",
              ["<", ["get", "value"], _this.linkmin],
              "#ffffff", //<10.8
              ["<", ["get", "value"], _this.linkmin + ll * _this.linkstep],
              "#51e1e6", //>=10.8 & <17.2
              [
                "<",
                ["get", "value"],
                _this.linkmin + (ll + 1) * _this.linkstep,
              ],
              "#40a9d9",
              [
                "<",
                ["get", "value"],
                _this.linkmin + (ll + 2) * _this.linkstep,
              ],
              "#3175ce",
              [
                "<=",
                ["get", "value"],
                _this.linkmin + (ll + 3) * _this.linkstep,
              ],
              "#2549c4",
              [
                "<=",
                ["get", "value"],
                _this.linkmin + (ll + 4) * _this.linkstep,
              ],
              "#140fb8", //>=41.5 & <50.1
              "#140fb8" // 默认值, >=50.1
            ],
          },
          filters: ["in", "type", "MultiLineString"],
        });

        _this.map.addLayer({
          id: "vectorLayer" + _this.layerNumber + "point",
          type: "circle",
          source: "source-id" + _this.layerNumber,
          paint: {
            "circle-color": [
              "case",
              ["<", ["get", "value"], _this.nodemin],
              "#ffffff", //<10.8
              ["<", ["get", "value"], _this.nodemin + ll * _this.nodestep],
              "#fdd519", //>=10.8 & <17.2
              [
                "<",
                ["get", "value"],
                _this.nodemin + (ll + 1) * _this.nodestep,
              ],
              "#f8a114",
              [
                "<",
                ["get", "value"],
                _this.nodemin + (ll + 2) * _this.nodestep,
              ],
              "#f36f0f",
              [
                "<=",
                ["get", "value"],
                _this.nodemin + (ll + 3) * _this.nodestep,
              ],
              "#ee430b",
              [
                "<=",
                ["get", "value"],
                _this.nodemin + (ll + 4) * _this.nodestep,
              ],
              "#e90806", //>=41.5 & <50.1
              "#e90806", // 默认值, >=50.1
            ],
          },
          filters: ["in", "type", "Point"],
        });
        _this.map.on(
          "mouseenter",
          "vectorLayer" + _this.layerNumber + "point",
          function () {
            _this.map.getCanvas().style.cursor = "pointer";
          }
        );
        _this.map.on(
          "mouseleave",
          "vectorLayer" + _this.layerNumber + "point",
          function () {
            _this.map.getCanvas().style.cursor = "";
          }
        );
        _this.map.on(
          "mouseenter",
          "vectorLayer" + _this.layerNumber + "line",
          function () {
            _this.map.getCanvas().style.cursor = "pointer";
          }
        );
        _this.map.on(
          "mouseleave",
          "vectorLayer" + _this.layerNumber + "line",
          function () {
            _this.map.getCanvas().style.cursor = "";
          }
        );
        _this.layerNumber++;

        // slider
        _this.timeSliderMap = false;
        _this.maxSlider = _this.rptResult.Date.length;
        _this.marks = {
          1: _this.formatTooltip(1),
        };

        // btn
        _this.startBtn = false;
        _this.conduitStartBtn = false;
      });

      // map Tab

      //conduit
    },
    changeChooseMap(e) {
      // 还原slider
      e.numberAnima = 32;
      e.timeSlider = 33;

      e.loading = true;
      e.propertySelectVisible = false;
      // 获取所有要素的选中属性
      e.nodeResultArr = [];
      e.linkResultArr = [];
      for (let i = 0; i < e.options[0].children.length; i++) {
        // node
        var node = e.options[0].children[i];
        var element = node.children[e.nodeRadio];
        e.nodeResultArr.push(element.data); // 汇总该属性的所有模拟值
      }
      for (let k = 0; k < e.rptResult.Node.length; k++) {
        // 更新geojsonObject
        var feat = e.geojsonObject.features[k];
        feat.properties.value = e.nodeResultArr[k][0];
      }
      for (let i = 0; i < e.options[1].children.length; i++) {
        // link
        var link = e.options[1].children[i];
        var element = link.children[e.linkRadio];
        e.linkResultArr.push(element.data);
      }
      for (let k = 0; k < e.rptResult.Link.length; k++) {
        // 更新geojsonObject
        var feat = e.geojsonObject.features[e.rptResult.Node.length + k];
        feat.properties.value = e.linkResultArr[k][0];
      }
      // 获取最大最小值
      if (e.nodeRadio == 0) {
        // node
        e.nodemin = e.rptResult.MaxMin.node.minInflow;
        e.nodemax = e.rptResult.MaxMin.node.maxInflow;

        let max = e.rptResult.MaxMin.node.maxInflow;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      } else if (e.nodeRadio == 1) {
        e.nodemin = e.rptResult.MaxMin.node.minFlooding;
        e.nodemax = e.rptResult.MaxMin.node.maxFlooding;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      } else if (e.nodeRadio == 2) {
        e.nodemin = e.rptResult.MaxMin.node.minDepth;
        e.nodemax = e.rptResult.MaxMin.node.maxDepth;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      } else if (e.nodeRadio == 3) {
        e.nodemin = e.rptResult.MaxMin.node.minHead;
        e.nodemax = e.rptResult.MaxMin.node.maxHead;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      }
      if (e.linkRadio == 0) {
        // link
        e.linkmin = e.rptResult.MaxMin.link.minFlow;
        e.linkmax = e.rptResult.MaxMin.link.maxFlow;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      } else if (e.linkRadio == 1) {
        e.linkmin = e.rptResult.MaxMin.link.minVelocity;
        e.linkmax = e.rptResult.MaxMin.link.maxVelocity;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      } else if (e.linkRadio == 2) {
        e.linkmin = e.rptResult.MaxMin.link.minDepth;
        e.linkmax = e.rptResult.MaxMin.link.maxDepth;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      } else if (e.linkRadio == 3) {
        e.linkmin = e.rptResult.MaxMin.link.minCapacity;
        e.linkmax = e.rptResult.MaxMin.link.maxCapacity;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      }
      e.map.setZoom(14);
      e.map.setCenter({ lng: 120.845, lat: 31.037 });
      e.sliderChange(33);
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
    refreshOpenlayer(e) {
      let feature = e.map.queryRenderedFeatures({
        layers: ["vectorLayer" + 0 + "point"],
      });
      let ll = 1;
      e.map.getSource("source-id" + 0).setData(e.geojsonObject);
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
        let dateDay = this.rptResult.Date[val - 1].split(/ +/)[0];
        let dateSec = this.rptResult.Date[val - 1].split(/ +/)[1];
        let nyr = dateDay.split("-");
        let hms = dateSec.split(":");
        let dateStr = nyr[2] + "-" + nyr[1] + "-";
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
      let _this = this;
      _this.intevalAnima = setInterval(() => {
        if (_this.numberAnima == _this.rptResult.Date.length) {
          _this.numberAnima = 0;
          _this.timeSlider = 1;
        }
        for (let i = 0; i < _this.rptResult.Node.length; i++) {
          // 更新geojsonObject
          let feat = _this.geojsonObject.features[i];
          _this.geojsonObject.features[i].properties.value =
            _this.nodeResultArr[i][_this.numberAnima];
        }
        for (let k = 0; k < _this.rptResult.Link.length; k++) {
          // 更新geojsonObject
          let feat =
            _this.geojsonObject.features[_this.rptResult.Node.length + k];
          _this.geojsonObject.features[
            _this.rptResult.Node.length + k
          ].properties.value = _this.linkResultArr[k][_this.numberAnima];
        }
        // 更新openlayer
        _this.refreshOpenlayer(_this);
        _this.numberAnima++;
        _this.timeSlider++;
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
