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
        <el-table :data="modelList" style="margin-top:17px;" empty-text="没有模型数据">
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
                size="default"
                type="success"
                @click="loadModelItem(scope.$index, scope.row); clearFiles()"
                >载入
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="container">
        <div style="margin:10px 10px 20px 10px;">
          <i class="el-icon-setting" style="margin-right:10px;color:#08b1f6"></i>
          <strong>模型模块化耦合控制区</strong>
        </div>
        <p style="text-align:left">模型对象化模块体系文档</p>
        <div class="coupleDoc">
          <p v-show="modelConfig.length===0">模型文档未载入...</p>
          <el-card v-for="(item, index) in modelConfig" :key="index" style="margin:2px;">
            <p>模型名称： {{ item.name }}</p>
            <el-divider></el-divider>
            <p style="float:left;margin-top:10px;">{{item.name}}配置文件: </p>
            <div style="text-align:center;vertical-align:middle;">
              <el-input
                :placeholder="item.configName"
                :disabled="true"
                style="width:50%;margin:0 auto"
              >
                {{ item.configName }}
              </el-input>
              <el-button style="margin:5px;" 
              type="primary"  circle><el-icon><bottom /></el-icon> </el-button>
              
            </div>
            <el-divider></el-divider>
          </el-card>
        </div>
        <el-button
        type="primary"
        size="default"
        plain
        style="margin:10px;position:relative;left: 40%;top: 20px;"
        @click="invoke()"
        ><el-icon style="margin-right:5px"><pointer /></el-icon>调用</el-button>
        <p style="text-align:left">结果输出</p>
        <div class="coupleDoc">
          <p v-show="!isShow">暂无运行结果...</p>
          <div v-show="isShow" >
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
        </div>
        
       
        <el-button
          type="primary"
          plain
          style="margin:10px;position:relative;left: 40%;top: 20px;"
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
      <el-table :data="list" style="margin-top:17px;" empty-text="没有模型数据">
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
            <el-button size="default" v-if="scope.row.select === false" type="success" 
              @click="selectModelItem(scope.$index, scope.row)">{{scope.row.select ? '已选':'选择'}}
            </el-button>
            <el-button size="default" v-if="scope.row.select === true" type="info">{{scope.row.select ? '已选':'选择'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
      </div>
    </el-dialog>

    <el-dialog
      title="配置耦合文档"
      v-model="deployDocument"
      width="50%"
      :before-close="handleCloseDeployDocument"
    >
      <el-card>
        <div style="position: relative;">
          <el-upload
            ref="configUpload"
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="uploadChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </div>
        <div v-highlight v-if="xml_show !== ''">
          <pre class="language-xml"> 
            <code>{{xml_show}} </code>
          </pre>
        </div>
        
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
import { UploadFilled,Bottom,Pointer } from '@element-plus/icons-vue'
export default {
  name:"Operation",
  components:{
    Navbar,
    UploadFilled,
    Bottom,
    Pointer,
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
          author: "美国环境保护局",
          select:false,
        },
        {
          oid: "5738ef7c-a5ac-46b5-a347-3c823f71b3a7",
          name: "LISFLOOD-FP",
          description:
            "LISFLOOD-FP是一种二维水动力模型，由英国布里斯托尔大学开发并由Paul Bates和Ad De Roo等人在2000年提出，经过多次的更新迭代，目前已广泛应用于一维河道水力模拟以及二维蓄洪区的水力变化，对城市内涝、河道洪泛的研究模拟具有很好的模拟效果。",
          author: "Paul Bates, Mark Trigg, Jeff Neal and Amy Dabrowa",
          select:false,
        },
        {
          oid: "b3a88af1-3568-4219-99c4-aa8fbce3227d",
          name: "ANUGA",
          description:
            "ANUGA模型是一种流体力学建模工具，允许用户在复杂的二维几何形状中建模模拟现实的流动问题。是由Stephen Roberts，Ole Nielsen,Duncan Gray,Jane Sexton等人开发。ANUGA的核心是流体动力学模块，称为Shallow_water，它是基于求解浅水波方程的有限体积方法。研究区域用三角形网格表示。通过求解每个单元内的控制方程，可以跟踪水深和水平动量随时间的变化。",
          author: "Stephen Roberts，Ole Nielsen,Duncan Gray,Jane Sexton",
          select:false,
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
      ],
      modelSelectStatus:'选择',
    };
  },
  methods: {
    handleClose(done) {
      this.dialogVisible = false;
    },
    handleCloseDeployDocument(done) {
      this.deployDocument = false;
    },
    searchModelItem() {},
    selectModelItem(index, info) {
      let modelObj = {
        oid:info.oid,
        name:info.name,
        description:info.description,
        author:info.author,
      }
      this.modelList.push(modelObj);
      this.$message({
        message:'选择模型成功',
        type:'success',
      })
      info.select = !info.select;
    },
    loadModelItem(index, info) {
      this.xml_show = '';
      this.fileList = '';
      this.deployDocument = true;
      let modelObj = {
        oid:info.oid,
        name:info.name,
        description:info.description,
        author:info.author,
      }
      this.loadModel = modelObj;
    },
    //调用上传的删除方法，清除上传文件列表
    clearFiles(){
      this.$refs['configUpload'].clearFiles();
    },
    //上传文件，并展示内容到页面上
    uploadChange(file, fileList) {
      this.uploadFiles = fileList;
      
      let _this = this;
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
          } else {
            this.$message.error("载入失败");
          }
        } else {
          this.$message.error("服务器error");
        }
      });
    },
    //载入配置文件到模型模块化耦合控制区操作面板
    confirmLoad() {    
      this.modelConfig.push({
        name: this.loadModel.name,
        configName: this.loadModel.name + ".conf",
      });
      this.deployDocument = false;
    },
    //调用函数
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
  mounted() {

  }
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
}
.container {
  flex: 1; /*这里设置为占比1，填充满剩余空间*/
  overflow: auto !important;
}
.coupleDoc{
  min-height: 100px;
  border-color: #607d8b;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
}

</style>
