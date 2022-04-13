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
      nodemin: 0,
      nodestep: 1,
      linkmin: 0,
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
          .get("quo_5.disp")
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
          .get("quo.geojson")
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
        var max = this.rptResult.MaxMin.node.maxInflow;
        this.nodestep = (max - this.nodemin) / 5;
      } else if (this.nodeRadio == 1) {
        this.nodemin = this.rptResult.MaxMin.node.minFlooding;
        var max = this.rptResult.MaxMin.node.maxFlooding;
        this.nodestep = (max - this.nodemin) / 5;
      } else if (this.nodeRadio == 2) {
        this.nodemin = this.rptResult.MaxMin.node.minDepth;
        var max = this.rptResult.MaxMin.node.maxDepth;
        this.nodestep = (max - this.nodemin) / 5;
      } else if (this.nodeRadio == 3) {
        this.nodemin = this.rptResult.MaxMin.node.minHead;
        var max = this.rptResult.MaxMin.node.maxHead;
        this.nodestep = (max - this.nodemin) / 5;
      }
      if (this.linkRadio == 0) {
        // link
        this.linkmin = this.rptResult.MaxMin.link.minFlow;
        var max = this.rptResult.MaxMin.link.maxFlow;
        this.linkstep = (max - this.linkmin) / 5;
      } else if (this.linkRadio == 1) {
        this.linkmin = this.rptResult.MaxMin.link.minVelocity;
        var max = this.rptResult.MaxMin.link.maxVelocity;
        this.linkstep = (max - this.linkmin) / 5;
      } else if (this.linkRadio == 2) {
        this.linkmin = this.rptResult.MaxMin.link.minDepth;
        var max = this.rptResult.MaxMin.link.maxDepth;
        this.linkstep = (max - this.linkmin) / 5;
      } else if (this.linkRadio == 3) {
        this.linkmin = this.rptResult.MaxMin.link.minCapacity;
        var max = this.rptResult.MaxMin.link.maxCapacity;
        this.linkstep = (max - this.linkmin) / 5;
      }
      console.log(this.options)
      this.map.setView(
        new mapboxgl.View({
          projection: "EPSG:4326",
          // center: this.geojsonObject.features[0].geometry.coordinates,
          center: [120.845, 31.037],
          zoom: 14,
        })
      );

      // 更新openlayer
      // this.refreshOpenlayer()

      // setTimeout(()=>{
      this.sliderChange(33);
      // },0)
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
       this.numberAnima = val-1
      for (let i = 0; i < this.rptResult.Node.length; i++) {// 更新geojsonObject
        var feat = this.geojsonObject.features[i];
        feat.properties.value = this.nodeResultArr[i][this.numberAnima]
      }
      for (let k = 0; k < this.rptResult.Link.length; k++) {// 更新geojsonObject
        var feat = this.geojsonObject.features[this.rptResult.Node.length + k];
        feat.properties.value = this.linkResultArr[k][this.numberAnima]
      }
      // 更新openlayer
      this.refreshOpenlayer()
    },
    refreshOpenlayer() {
      var that = this;
      var styleFunction = function (feature) {
        // 获取要素名称和值
        var name = feature.get("name");
        var value = feature.get("value");
        var geometry = feature.getGeometry();
        //获取要素类型，点线面
        var type = feature.getGeometry().getType();
        var styles = [];
        var nodecolor = "";
        var linkcolor = "";

        // 计算色带步长
        var nodecolors = [
          "#fdd519",
          "#f8a114",
          "#f36f0f",
          "#ee430b",
          "#e90806",
        ];
        var linkcolors = [
          "#51e1e6",
          "#40a9d9",
          "#3175ce",
          "#2549c4",
          "#140fb8",
        ];
        if (type == "Point") {
          if (that.nodestep == 0) {
            nodecolor = nodecolors[0];
          } else {
            var index = Math.floor((value - that.nodemin) / that.nodestep);
            if (index == 5) index = 4;
            nodecolor = nodecolors[index];
          }
          styles.push(
            new mapboxgl.style.Style({
              image: new mapboxgl.style.Circle({
                radius: 3,
                fill: new mapboxgl.style.Fill({
                  //填充样式
                  color: nodecolor,
                }),
              }),
            })
          );
        } else if (type == "LineString" || type == "MultiLineString") {
          if (that.linkstep == 0) {
            linkcolor = linkcolors[0];
          } else {
            var index = Math.floor((value - that.linkmin) / that.linkstep);
            if (index == 5) index = 4;
            linkcolor = linkcolors[index];
          }
          styles.push(
            new mapboxgl.style.Style({
              stroke: new mapboxgl.style.Stroke({
                color: linkcolor,
                width: 2,
              }),
            })
          );
          if (type == "LineString") {
            // arrows
            geometry.forEachSegment(function (start, end) {
              var dx = end[0] - start[0];
              var dy = end[1] - start[1];
              var arrow = [start[0] + dx / 2, start[1] + dy / 2];
              var rotation = Math.atan2(dy, dx);
              // arrows
              styles.push(
                new mapboxgl.style.Style({
                  geometry: new mapboxgl.geom.Point(arrow),
                  image: new mapboxgl.style.Icon({
                    src: "https://gitee.com/apollozs/typora-images/blob/master/imgs/arrow2.svg",
                    //'https://gitee.com/apollozs/typora-images/raw/master/imgs/arrow2.svg',
                    anchor: [0.5, 0.5],
                    rotateWithView: true,
                    rotation: -rotation,
                  }),
                })
              );
            });
          } else {
            var linestrings = geometry.getLineStrings();
            for (let i = 0; i < linestrings.length; i++) {
              var start = linestrings[i].flatCoordinates.slice(0, 2);
              var end = linestrings[i].flatCoordinates.slice(-2);
              var dx = end[0] - start[0];
              var dy = end[1] - start[1];
              var arrow = [start[0] + dx / 2, start[1] + dy / 2];
              var rotation = Math.atan2(dy, dx);
              // arrows
              styles.push(
                new mapboxgl.style.Style({
                  geometry: new mapboxgl.geom.Point(arrow),
                  image: new mapboxgl.style.Icon({
                    src: "https://gitee.com/apollozs/typora-images/blob/master/imgs/arrow2.svg", //'https://gitee.com/apollozs/typora-images/raw/master/imgs/arrow2.svg',
                    anchor: [0.5, 0.5],
                    rotateWithView: true,
                    rotation: -rotation,
                  }),
                })
              );
            }
          }
        } else {
          styles.push(
            new mapboxgl.style.Style({
              stroke: new mapboxgl.style.Stroke({
                color: "#ccc",
                width: 1,
              }),
              fill: new mapboxgl.style.Fill({
                color: "rgba(0, 0, 255, 0.1)",
              }),
              text: new mapboxgl.style.Text({
                font: "10px Garamond",
                text: name,
              }),
            })
          );
        }

        // 下面两句代码太耗时间 使用全局变量
        // var nodemin = Math.min.apply(null, that.nodeResultArr.join(",").split(","))
        // var nodestep = (Math.max.apply(null, that.nodeResultArr.join(",").split(",")) - nodemin)/5

        return styles;
      };

      // 判断是否为第一次加载
      if (this.vectorLayer != null) {
        // this.map.removeLayer(this.vectorLayer)
        // 动态更新则可以已通过变量进行，否则从文件里读取也不现实
        this.vectorLayer.setSource(
          new mapboxgl.source.Vector({
            // projection: 'EPSG:4326', // 可以省略
            features: new mapboxgl.format.GeoJSON().readFeatures(
              this.geojsonObject
            ),
          })
        );
        this.vectorLayer.setStyle(styleFunction);
      } else {
        // 第一次不能从变量里加载，会出现错位问题，原因未知
        var vectorSource = new mapboxgl.source.Vector({
          projection: "EPSG:4326",
          url: "./" + this.dataName + "/" + this.dataName + ".geojson",
          format: new mapboxgl.format.GeoJSON(),
        });
        this.vectorLayer = new mapboxgl.layer.Vector({
          source: vectorSource,
          style: styleFunction,
        });
        this.map.addLayer(this.vectorLayer);
      }

      this.loadingInterval = setInterval(() => {
        if (this.map.tileQueue_.getTilesLoading() == 0) {
          this.loading = false;
        }
      }, 1000);
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
          var feat = this.geojsonObject.features[i];
          feat.properties.value = this.nodeResultArr[i][this.numberAnima];
        }
        for (let k = 0; k < this.rptResult.Link.length; k++) {
          // 更新geojsonObject
          var feat =
            this.geojsonObject.features[this.rptResult.Node.length + k];
          feat.properties.value = this.linkResultArr[k][this.numberAnima];
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
