<template>
  <div v-loading="loading">
    <div class="navbar">
        <navbar></navbar>
      </div>
    <div class="parent">
      <el-card class="left">
        <i class="el-icon-thumb" style="color:#08b1f6"></i><strong style="margin:10px;">耦合模型选择区</strong>
        <el-button type="primary" plain @click="dialogVisible = true">
          模型选择
        </el-button>
        <el-table :data="modelList" style="margin-top:17px;">
          <el-table-column type="expand">
            <template #default="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="Overview">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name">
          </el-table-column>
          <el-table-column label="作者" prop="author">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button
                size="mini"
                type="success"
                @click="loadModelItem(scope.$index, scope.row)"
                >载入
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="container">
        <div style="margin:10px 10px 20px 10px;">
          <i class="el-icon-setting" style="margin-right:10px;color:#08b1f6"></i>
          <strong>模型模块化偶耦合控制区</strong>
        </div>
        <p style="margin:0 0 10px 0;">模型对象化模块体系文档</p>
        <el-card v-for="(item, index) in modelConfig" :key="index" style="margin:2px">
          <p>模型名称： {{ item.name }}</p>
          <el-divider></el-divider>
          <p style="float:left;margin-top:10px;">{{item.name}}配置文件: </p>
          <div style="text-align:center;vertical-align:middle;">
            <el-input
              :placeholder="item.configName"
              v-model="input"
              :disabled="true"
              style="width:50%;margin:0 auto"
            >
              {{ item.configName }}
            </el-input>
            <el-button class="el-icon-download" style="margin:5px;" 
            type="primary"  circle></el-button>
          </div>
          <el-divider></el-divider>
        </el-card>
        <div v-show="isShow" >
         <p style="margin-top:20px">结果输出</p>
         <el-card v-for="(item, index) in modelConfig" :key="index" style="margin:2px">            
            <el-form :label-position="labelPosition" :model="item">
               
              <el-form-item :label=item.name>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in output_swmm"
                    :key="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button class="el-icon-download" style="margin:5px;" 
            type="primary"  circle></el-button>
            <el-button class="el-icon-view" style="margin:5px" type="primary"  circle></el-button>
              </el-form-item>
            </el-form>
            
          </el-card>
          </div>
        <el-button
          type="primary"
          plain
          style="margin:10px;position:relative;left:70%"
          @click="invoke()"
          >调用</el-button>
        <el-button
          type="primary"
          plain
          style="margin:10px;position:relative;left:70%"
          @click="showCouple()"
          >耦合结果展示</el-button>
         
      </el-card>
    </div>

    <el-dialog
      title="模型选择"
      v-model="dialogVisible"
      width="50%"
      top="150px"
      :before-close="handleClose"
    >
      <el-input
        placeholder="模型条目名称..."
        v-model="list.name"
        class="input-with-select"
        @keyup.enter="searchModelItem()"
      >
        <el-button
          icon="el-icon-search"
          @click="searchModelItem()"
        ></el-button>
      </el-input>
      <el-table :data="list" style="margin-top:17px;">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="Overview">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name">
        </el-table-column>
        <el-table-column label="作者" prop="author">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button
              size="mini"
              type="success"
              @click="selectModelItem(scope.$index, scope.row)"
              >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button
          type="primary"
          style="position: relative;left: 45%;margin-top: 1.5%;"
          @click="confirmSelect()"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="配置耦合文档"
      v-model="deployDocument"
      width="50%"
      :before-close="handleClose"
    >
      <el-card>
        <div style="position: relative;">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="uploadChange"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </div>
        <!-- <el-button
          type="primary"
          style="position:relative;left: 80%;"
          @click="confirmLoad()"
          >载入耦合文档
        </el-button> -->
        <!-- <pre v-highlightjs="xml_show">  -->
        <pre > 
          <code class="highlight_s">{{xml_show}} </code>
        </pre>
      </el-card>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="deployDocument = false">取 消</el-button>
            <el-button type="primary" @click="confirmLoad()"
            >载入耦合文档</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
// import vkbeautify from "vkbeautify";
import Navbar  from '../components/Navbar'
import { UploadFilled } from '@element-plus/icons-vue'
export default {
  name:"Operation",
  components:{
    Navbar,
    UploadFilled,
  },
  data() {
    return {
      dialogVisible: false,
      deployDocument: false,
      list: [
        {
          oid: "3f6857ba-c2d2-4e27-b220-6e5367803a12",
          name: "SWMM",
          description:
            "SWMM在1971年由美国环境保护局联合多家企业单位共同开发问世，最初只能完成一些诸如不确定性参数验证以及简单的雨洪过程模拟，后来经历多次的升级迭代，被广泛应用于城市雨水径流模拟、地下管网的水流模拟、LID模拟、雨水模拟以及与其他的排水系统相结合进行各种排水规划、设计与排水分析工作。目前版本已更新到SWMM5，可以对研究区域的输入数据进行编辑，以及可以执行各种水文、水力以及水质的模拟工作。",
          author: "美国环境保护局"
        },
        {
          oid: "5738ef7c-a5ac-46b5-a347-3c823f71b3a7",
          name: "LISFLOOD-FP",
          description:
            "LISFLOOD-FP是一种二维水动力模型，由英国布里斯托尔大学开发并由Paul Bates和Ad De Roo等人在2000年提出，经过多次的更新迭代，目前已广泛应用于一维河道水力模拟以及二维蓄洪区的水力变化，对城市内涝、河道洪泛的研究模拟具有很好的模拟效果。",
          author: "Paul Bates, Mark Trigg, Jeff Neal and Amy Dabrowa"
        },
        {
          oid: "b3a88af1-3568-4219-99c4-aa8fbce3227d",
          name: "ANUGA",
          description:
            "ANUGA模型是一种流体力学建模工具，允许用户在复杂的二维几何形状中建模模拟现实的流动问题。是由Stephen Roberts，Ole Nielsen,Duncan Gray,Jane Sexton等人开发。ANUGA的核心是流体动力学模块，称为Shallow_water，它是基于求解浅水波方程的有限体积方法。研究区域用三角形网格表示。通过求解每个单元内的控制方程，可以跟踪水深和水平动量随时间的变化。",
          author: "Stephen Roberts，Ole Nielsen,Duncan Gray,Jane Sexton"
        }
      ],
      modelList: [],
      modelConfig: [],
      xml_show: "",
      loadModel: {},
      loading: false,
      isShow:false,
      labelPosition:'left',
      output_swmm:[{
        label:'1',
        value:'out.inp'
      },
      {
        label:'2',
        value:'out.rpt'
      }],
      output_lisflood_fp:[
        {
          value:'out-0001.wd',
        },{
          value:'out-0002.wd',
        },{
          value:'out-0003.wd',
        },{
          value:'out-0004.wd',
        },{
          value:'out-0005.wd',
        },{
          value:'out-0006.wd',
        },{
          value:'out-0007.wd',
        },{
          value:'out-0008.wd',
        },{
          value:'out-0009.wd',
        },{
          value:'out-0010.wd',
        },
      ]
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    searchModelItem() {},
    selectModelItem(index, info) {
      console.log(`${index} and ${info}`)
      let modelObj = {
        oid:info.oid,
        name:info.name,
        description:info.description,
        author:info.author,
      }
      this.modelList.push(modelObj);
    },
    loadModelItem(index, info) {
      this.deployDocument = true;
      let modelObj = {
        oid:info.oid,
        name:info.name,
        description:info.description,
        author:info.author,
      }
      this.loadModel = modelObj;
    },
    uploadChange(file, fileList) {
      this.uploadFiles = fileList;
    },
    // on-change()
    confirmSelect() {
      this.dialogVisible = false;
    },
    confirmLoad() {
      let _this = this;
      //   this.fileDialog = false;
      //   this.loading = true;
      let form = new FormData();
      for (let i = 0; i < this.uploadFiles.length; i++) {
        form.append("datafile", this.uploadFiles[i].raw);
      }

      this.axios.post("/api/coupleDocument", form).then(res => {
        //解析该文件，返回xml字符串，赋值给xml_show
        if (res.status === 200) {
          let result = res.data;
          if (result.code === 0) {
            this.$message({
              message: "载入成功",
              type: "success"
            });
            _this.xml_show = result.data;
            _this.modelConfig.push({
              name: _this.loadModel.name,
              configName: _this.loadModel.name + ".conf",
              data: result.data
            });
          } else {
            this.$message.error("载入失败");
          }
        } else {
          this.$message.error("服务器error");
        }

        // _this.geojson = res.data.message.geojson;
        // let geojsonLayer = L.geoJSON(_this.geojson).addTo(_this.map);
        // geojsonLayer.addData(_this.geojson);
        // _this.loading = false;
      });
    },
    invoke() {
      //根据文件路径，调用exe，生成最终结果，并可视化
      let _this = this;
      _this.loading = true;
      //获取配置文件路径
      //根据路径，调用exe
      //生成数据，存储起来，提供下载
      setTimeout(() => {
        _this.loading = false;
        _this.isShow = true;
      }, 1000);
    },
    showCouple(){

    },
  },
  mounted() {}
};
</script>
<style>
.parent {
  border: 1px solid #222;
  display: flex; /*设为伸缩容器*/
  flex-flow: row;
  height: calc(100vh - 120px);
}
.left {
  width: 20%; /*固定宽度*/
  border: 1px solid #ccc;
  margin-left: 20px;
}
.container {
  flex: 1; /*这里设置为占比1，填充满剩余空间*/
  border: 1px solid #222;
}
</style>
