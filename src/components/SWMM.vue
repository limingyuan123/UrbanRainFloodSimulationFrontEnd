<!-- mapbox -->
<template>
  <div
    class="tool"
    style="
      margin-left: 10px;
      margin-top: 10px;
      border-radius: 15px;
      opacity: 0.8;
    "
  >
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="card"
      style="height: 100%"
      stretch
      id="tab"
    >
      <el-tab-pane label="管网图" name="first" style="height: 100%">
        <el-tabs
          v-loading="loading"
          tab-position="left"
          style="height: 100%"
          @tab-click="handleClick"
          stretch
        >
          <el-tab-pane label="72mm" name="quo_5">
            <div class="select">
              <el-select
                v-model="NT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in NodePopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="LT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in LinkPopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-tab-pane>
          <el-tab-pane label="89mm" name="quo_10">
            <div class="select">
              <el-select
                v-model="NT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in NodePopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="LT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in LinkPopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-tab-pane>
          <el-tab-pane label="104mm" name="quo_20">
            <div class="select">
              <el-select
                v-model="NT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in NodePopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="LT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in LinkPopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-tab-pane>
          <el-tab-pane label="112mm" name="quo_30">
            <div class="select">
              <el-select
                v-model="NT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in NodePopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="LT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in LinkPopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-tab-pane>
          <el-tab-pane label="121mm" name="quo_50">
            <div class="select">
              <el-select
                v-model="NT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in NodePopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="LT_showInPop"
                placeholder=""
                @change="selectChange"
              >
                <el-option
                  v-for="item in LinkPopType"
                  :key="item"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- File -->
      </el-tab-pane>
      <el-tab-pane label="流向图" name="second">Operation</el-tab-pane>
      <!-- <el-tab-pane label="Simulation" name="third">Simulation</el-tab-pane>
        <el-tab-pane label="Coupling analysis" name="fourth">Coupling analysis</el-tab-pane> -->
    </el-tabs>
    <div
      id="time-slider"
      style="background: white; border-radius: 15px; width: 100%; bottom: -20%"
    >
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
      <el-button size="small" round @click="startAnimation" :disabled="startBtn"
        >Start</el-button
      >
      <el-button size="small" round @click="pauseAnimation" :disabled="pauseBtn"
        >Pause</el-button
      >
    </div>
  </div>
  <div id="map"></div>
</template>
<script>
//样式引入
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl";
import * as echarts from "echarts";
//定义变量使用
const mapboxgl = require("mapbox-gl");
export default {
  name: "SWMM",
  data() {
    return {
      echar: "",
      loading: true,
      NT_showInPop: "Inflow",
      LT_showInPop: "Flow",
      rptResult: {},
      isCollapse: true,
      fileDialog: false,
      loading: false,
      uploadFiles: [],
      propertySelectVisible: false,
      selData: [],
      selTitle: "",
      geojson: "",
      geojsonObject: {},
      geojsonLayer: Object,
      viewer: Object,
      fileList: [],
      flag: -1,
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
      NodePopType: [
        { value: "Inflow" },
        { value: "Flooding" },
        { value: "Depth" },
        { value: "Head" },
      ],
      LinkPopType: [
        { value: "Flow" },
        { value: "Velocity" },
        { value: "Depth" },
        { value: "Capacity" },
      ],
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
      // this.map.on("click", function (e) {
      //   console.log("点击");
      // });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    selectChange(value) {
      this.SetPop(this.layerNumber - 1);
    },
    handleClick(tab, event) {
      this.openFileDialog(tab.props.name + ".disp", "quo.geojson");
    },
    getrptResult(e, url) {
      return new Promise((resolve, reject) => {
        e.axios
          .get(url)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getGeojson(e, url) {
      return new Promise((resolve, reject) => {
        e.axios
          .get(url)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    initEchart(x, y, id, chart_name) {
      //this.echar = echarts.init(document.getElementById(id));
      this.echar = echarts.init(document.getElementById(id));
      let data = y;
      let date = x;
      // 指定图表的配置项和数据
      var option1 = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [chart_name],
        },
        grid: {
          left: "10%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: date,
        },
        yAxis: {
          type: "value",
        },

        series: [
          {
            name: chart_name,
            type: "line",
            data: data,
          },
        ],
      };
      this.echar.clear();
      this.echar.setOption(option1);
    },
    openFileDialog(disp_url, geo_url) {
      this.loading = true;
      let f = this.getrptResult(this, disp_url);
      let ff = this.getGeojson(this, geo_url);
      let _this = this;

      Promise.all([f, ff])
        .then((array) => {
          _this.rptResult = array[0];
          _this.geojsonObject = array[1];
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
          if (_this.layerNumber > 0) {
            _this.map.removeLayer(
              "vectorLayer" + (_this.layerNumber - 1) + "line"
            );
            _this.map.removeLayer(
              "vectorLayer" + (_this.layerNumber - 1) + "point"
            );
            _this.map.removeSource("source-id" + (_this.layerNumber - 1));

            _this.layerNumber--;
          }
          _this.map.addSource("source-id" + _this.layerNumber, {
            type: "geojson",
            data: _this.geojsonObject,
          });
          let ll = 1;
          _this.map.addLayer({
            id: "vectorLayer" + _this.layerNumber + "line",
            type: "line",
            source: "source-id" + _this.layerNumber,
            paint: {
              "line-width": 3,
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
                "#140fb8", // 默认值, >=50.1
              ],
            },
            filter: ["in", "$type", "LineString"],
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
            filter: ["in", "$type", "Point"],
          });
          _this.SetPop(_this.layerNumber);
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
          setTimeout(function () {
            _this.loading = false;
          }, 300);
        })
        
          
        
    },
    Npopclick(e) {
      e.preventDefault();
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      let y = this.options[0].children
        .find((child) => child.label == e.features[0].properties.name)
        .children.find((Flooding) => Flooding.value == this.NT_showInPop).data;
      let x = this.rptResult.Date;
      new mapboxgl.Popup({
        className: "Point_pop",
        maxWidth: "800px",
      })
        .setLngLat(e.lngLat)
        .setHTML(
          "<div id=" + "e_chart_P" + " style='height:400px;width:600px;'></div>"
        )
        .addTo(this.map);
      setTimeout(() => {
        this.initEchart(x, y, "e_chart_P", this.NT_showInPop);
      }, 1);
    },
    LPopclick(e) {
      if (e.defaultPrevented) {
      } else {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        let y = this.options[1].children
          .find((child) => child.label == e.features[0].properties.name)
          .children.find(
            (Flooding) => Flooding.value == this.LT_showInPop
          ).data;
        let x = this.rptResult.Date;
        new mapboxgl.Popup({ maxWidth: "800px" })
          .setLngLat(e.lngLat)
          .setHTML(
            "<div id='e_chart_L' style='height:400px;width:600px;'></div>"
          )
          .addTo(this.map);
        setTimeout(() => {
          this.initEchart(x, y, "e_chart_L", this.LT_showInPop);
        }, 1);
      }
    },
    menter(e) {
      this.map.getCanvas().style.cursor = "pointer";
    },
    mleave(e) {
      this.map.getCanvas().style.cursor = "";
    },
    SetPop(layerN) {
      if (this.map._listeners.click) {
        if (this.map._listeners.click.length > 0) {
          console.log(this.map._listeners);

          this.map.off(
            "click",
            "vectorLayer" + layerN + "point",
            this.Npopclick
          );
          this.map.off(
            "click",
            "vectorLayer" + layerN + "line",
            this.LPopclick
          );
          this.map.off(
            "mouseenter",
            "vectorLayer" + layerN + "point",
            this.menter
          );
          this.map.off(
            "mouseleave",
            "vectorLayer" + layerN + "point",
            this.mleave
          );
          this.map.off(
            "mouseenter",
            "vectorLayer" + layerN + "line",
            this.menter
          );
          this.map.off(
            "mouseleave",
            "vectorLayer" + layerN + "line",
            this.mleave
          );
        }
      }
      this.map.on("mouseenter", "vectorLayer" + layerN + "point", this.menter);
      this.map.on("mouseleave", "vectorLayer" + layerN + "point", this.mleave);
      this.map.on("mouseenter", "vectorLayer" + layerN + "line", this.menter);
      this.map.on("mouseleave", "vectorLayer" + layerN + "line", this.mleave);
      this.map.on("click", "vectorLayer" + layerN + "point", this.Npopclick);
      this.map.on("click", "vectorLayer" + layerN + "line", this.LPopclick);
    },
    changeChooseMap(e) {
      // 还原slider
      e.numberAnima = 0;
      e.timeSlider = 1;

      e.loading = true;
      e.propertySelectVisible = false;
      // 获取所有要素的选中属性
      e.nodeResultArr = [];
      e.linkResultArr = [];
      for (let i = 0; i < e.options[0].children.length; i++) {
        // node
        let node = e.options[0].children[i];
        let element = node.children.find(
          (Flooding) => Flooding.value == this.NT_showInPop
        );
        e.nodeResultArr.push(element.data); // 汇总该属性的所有模拟值
      }
      for (let k = 0; k < e.rptResult.Node.length; k++) {
        // 更新geojsonObject
        let feat = e.geojsonObject.features[k];
        feat.properties.value = e.nodeResultArr[k][0];
      }
      for (let i = 0; i < e.options[1].children.length; i++) {
        // link
        let link = e.options[1].children[i];
        let element = link.children.find(
          (Flooding) => Flooding.value == this.LT_showInPop
        );
        e.linkResultArr.push(element.data);
      }
      for (let k = 0; k < e.rptResult.Link.length; k++) {
        // 更新geojsonObject
        let feat = e.geojsonObject.features[e.rptResult.Node.length + k];
        feat.properties.value = e.linkResultArr[k][0];
      }
      // 获取最大最小值
      if (this.NT_showInPop == "Inflow") {
        // node
        e.nodemin = e.rptResult.MaxMin.node.minInflow;
        e.nodemax = e.rptResult.MaxMin.node.maxInflow;

        let max = e.rptResult.MaxMin.node.maxInflow;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      } else if (this.NT_showInPop == "Flooding") {
        e.nodemin = e.rptResult.MaxMin.node.minFlooding;
        e.nodemax = e.rptResult.MaxMin.node.maxFlooding;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      } else if (this.NT_showInPop == "Depth") {
        e.nodemin = e.rptResult.MaxMin.node.minDepth;
        e.nodemax = e.rptResult.MaxMin.node.maxDepth;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      } else if (this.NT_showInPop == "Head") {
        e.nodemin = e.rptResult.MaxMin.node.minHead;
        e.nodemax = e.rptResult.MaxMin.node.maxHead;
        e.nodestep = (e.nodemax - e.nodemin) / 5;
      }
      if (this.LT_showInPop == "Flow") {
        // link
        e.linkmin = e.rptResult.MaxMin.link.minFlow;
        e.linkmax = e.rptResult.MaxMin.link.maxFlow;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      } else if (this.LT_showInPop == "Velocity") {
        e.linkmin = e.rptResult.MaxMin.link.minVelocity;
        e.linkmax = e.rptResult.MaxMin.link.maxVelocity;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      } else if (this.LT_showInPop == "Depth") {
        e.linkmin = e.rptResult.MaxMin.link.minDepth;
        e.linkmax = e.rptResult.MaxMin.link.maxDepth;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      } else if (this.LT_showInPop == "Capacity") {
        e.linkmin = e.rptResult.MaxMin.link.minCapacity;
        e.linkmax = e.rptResult.MaxMin.link.maxCapacity;
        e.linkstep = (e.linkmax - e.linkmin) / 5;
      }
      e.map.setZoom(14);
      e.map.setCenter({ lng: 120.845, lat: 31.037 });
      e.sliderChange(1);
    },
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
      e.map
        .getSource("source-id" + (this.layerNumber - 1))
        .setData(e.geojsonObject);
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
        let dateStr = nyr[2] + "/" + nyr[1] + "/";
        for (let i = 0; i < month.length; i++) {
          if (month[i].toLowerCase().includes(nyr[0].toLowerCase())) {
            dateStr += ("0" + (i + 1)).slice(-2) + " " + hms.join(":");
          }
        }
        return dateStr;
      }
    },
    startAnimation() {
      this.startBtn = true;
      this.pauseBtn = false;
      let _this = this;
      console.log(_this.nodeResultArr);
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
  },
};
</script>

<style>
.el-tabs__content {
  height: 80%;
}
.el-tabs__nav.is-left {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.el-tabs__item.is-left {
  flex: 1;
}
.select {
  display: flex;
}
.el-select {
  flex: 1;
  padding: 5px;
}
#map {
  height: calc(100vh - 120px);
}

.mapboxgl-popup {
  max-width: 800px;
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
#e_chart .absolute {
  position: absolute;
  top: 80px;
  right: 0;
  width: 200px;
  height: 100px;
  border: 3px solid #73ad21;
}
.tool {
  background: white;
  height: 60%;
  width: 30%;
  position: absolute;
  /* top: 40%; */
  z-index: 1000;
  /* left: 0%; */
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 15px;
  opacity: 0.8;
  transition: width 2s;
  transition: height 2s;
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
