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
        <p class="paragraph">模型对象化模块体系文档</p>
        <div class="coupleDoc"  v-loading="downloadLoading">
          <p v-show="modelConfig.length===0">模型文档未载入...</p>
          <el-card v-for="(item, index) in modelConfig" :key="index" style="margin:2px;">
            <p class="paragraph">模型名称： {{ item.name }}</p>
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
              type="primary"  circle @click="downloadConfig(item.oid)"><el-icon><bottom /></el-icon> </el-button>
              
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
        <p class="paragraph">结果输出</p>
        <div class="coupleDoc" v-loading="downloadFileLoading">
          <p v-show="!isShow">暂无运行结果...</p>
          <div v-show="isShow" >
            <!-- <el-card v-for="(item, index) in modelConfig" :key="index" style="margin:2px">             -->
            <el-form :label-position="labelPosition">
              <el-form-item>
                <p style="float: left;margin-top: 35px;margin-right: 20px;margin-left: 20px;">输出结果：</p>
                <div style="text-align:center;vertical-align:middle;margin-top: 25px;">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="out in output"
                      :key="out.value"
                      :value="out.value"
                      v-model="selected"
                      />                  
                  </el-select>
                  <el-button style="margin:5px;" type="primary"  @click="downloadOutput()"
                  circle><el-icon><bottom /></el-icon></el-button>
                  <el-button style="margin:5px" type="primary"
                  circle><el-icon><video-play /></el-icon></el-button>
                </div>
              </el-form-item>
            </el-form>            
              <!-- </el-card> -->
          </div>
        </div>
        
       
        <el-button
          type="primary"
          plain
          style="margin:10px;position:relative;left: 40%;top: 20px;"
          @click="showMap"
          >
          <!-- <router-link to="couple"> -->
            <el-icon style="margin-right:5px"><promotion /></el-icon>
            耦合结果展示
          <!-- </router-link> -->
        </el-button>
         
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
<script setup>
// import vkbeautify from "vkbeautify";
import Navbar  from '../components/Navbar'
import { UploadFilled,Bottom,Pointer,View,VideoPlay,Promotion } from '@element-plus/icons-vue'
import { reactive, ref, computed ,toRefs} from 'vue';
import axios from 'axios'
import {ElMessage } from 'element-plus'
import {  useRouter} from 'vue-router'
const router = useRouter();
let dialog = reactive({
    dialogVisible:false,
    deployDocument: false,          
});

let {dialogVisible, deployDocument} = toRefs(dialog);

let load = reactive({
    loading: false,
    downloadLoading:false,
    downloadFileLoading:false,
});
let {loading, downloadLoading,downloadFileLoading} = toRefs(load);

let modelData = reactive({
  modelList: [],
  modelConfig: [],
  loadModel: {},
  loadModels:[],
  uploadFiles:[],
})

let {modelList, modelConfig,loadModel,loadModels,uploadFiles} = toRefs(modelData);
let configUpload = ref();
let value = ref('');
let xml_show = ref("");
let isShow = ref(false);
let labelPosition = ref('left');
let outputPath = ref('E:\\research\\yangtze_delta');

let list = [
  {
    oid: "3f6857ba-c2d2-4e27-b220-6e5367803a12",
    name: "SWMM",
    description:
      "SWMM在1971年由美国环境保护局联合多家企业单位共同开发问世，最初只能完成一些诸如不确定性参数验证以及简单的雨洪过程模拟，后来经历多次的升级迭代，被广泛应用于城市雨水径流模拟、地下管网的水流模拟、LID模拟、雨水模拟以及与其他的排水系统相结合进行各种排水规划、设计与排水分析工作。目前版本已更新到SWMM5，可以对研究区域的输入数据进行编辑，以及可以执行各种水文、水力以及水质的模拟工作。",
    author: "美国环境保护局",
    select:false,
    output:'output_swmm',
  },
  {
    oid: "5738ef7c-a5ac-46b5-a347-3c823f71b3a7",
    name: "LISFLOOD-FP",
    description:
      "LISFLOOD-FP是一种二维水动力模型，由英国布里斯托尔大学开发并由Paul Bates和Ad De Roo等人在2000年提出，经过多次的更新迭代，目前已广泛应用于一维河道水力模拟以及二维蓄洪区的水力变化，对城市内涝、河道洪泛的研究模拟具有很好的模拟效果。",
    author: "Paul Bates, Mark Trigg, Jeff Neal and Amy Dabrowa",
    select:false,
    output:'output_lisflood_fp',
  },
  {
    oid: "b3a88af1-3568-4219-99c4-aa8fbce3227d",
    name: "ANUGA",
    description:
      "ANUGA模型是一种流体力学建模工具，允许用户在复杂的二维几何形状中建模模拟现实的流动问题。是由Stephen Roberts，Ole Nielsen,Duncan Gray,Jane Sexton等人开发。ANUGA的核心是流体动力学模块，称为Shallow_water，它是基于求解浅水波方程的有限体积方法。研究区域用三角形网格表示。通过求解每个单元内的控制方程，可以跟踪水深和水平动量随时间的变化。",
    author: "Stephen Roberts，Ole Nielsen,Duncan Gray,Jane Sexton",
    select:false,
    output:'output_anuga',
  }        
];
  
let output = [{
    label:'1',
    path:'',
    value:'report1.rpt'
  },{
    label:'2',
    path:'',
    value:'output1.out'
  },{
    label:'3',
    path:'res_clip_testNoBciAndDoubleCouple1',
    value:'fenhu-0000.wd',
  },{
    label:'4',
    path:'res_clip_testNoBciAndDoubleCouple1',
    value:'fenhu-0001.wd',
  },{
    label:'5',
    path:'res_clip_testNoBciAndDoubleCouple1',
    value:'fenhu-0002.wd',
  },
];
    
//#region 
//关闭dialogVisible对话框
const handleClose = (done) => {
  dialog.dialogVisible = false;
};
//关闭deployDocument对话框
const handleCloseDeployDocument = (done) => {
  dialog.deployDocument = false;
};
//搜索模型
const searchModelItem = () => {};
//选择需要耦合的模型
const selectModelItem = (index, info)  =>{
  let modelObj = {
    oid:info.oid,
    name:info.name,
    description:info.description,
    author:info.author,
  }
  modelData.modelList.push(modelObj);
  ElMessage({
    message:'选择模型成功',
    type:'success',
  })
  info.select = !info.select;
};
//载入已选的模型
const loadModelItem = (index, info)  =>{
  xml_show.value = '';
  dialog.deployDocument = true;
  let modelObj = {
    oid:info.oid,
    name:info.name,
    description:info.description,
    author:info.author,
  }
  modelData.loadModel = modelObj;
  modelData.loadModels.push(modelObj);
};
//调用上传的删除方法，清除上传文件列表
const clearFiles = () => {
  if(configUpload.value !== undefined){     
    configUpload.value.clearFiles();
  }
};
//上传文件，并展示内容到页面上
const uploadChange = (file, fileList)  =>{
  if (file.status !== 'ready') return;
  let fileObj = {
    file:fileList,
    name:modelData.loadModel.name,
    description:modelData.loadModel.description,
    author:modelData.loadModel.author,        
    oid:modelData.loadModel.oid,
  }
  modelData.uploadFiles.push(fileObj);
  
  let form = new FormData();
  for (let i = 0; i < modelData.uploadFiles.length; i++) {
    //上传文件信息以及模型信息
    form.append("datafile", modelData.uploadFiles[i].raw);
  }

  for(let item of modelData.uploadFiles){
    //上传文件信息以及模型信息
    form.append("datafile", item.file[0].raw);
    form.append("name", item.name);
    form.append("description", item.description);
    form.append("author", item.author);
    form.append("oid", item.oid);
  }
  axios.post("/api/coupleDocument", form).then(res => {
    //解析该文件，返回xml字符串，赋值给xml_show
    if (res.status === 200) {
      let result = res.data;
      if (result.code === 0) {
        ElMessage({
          message: "载入成功",
          type: "success"
        });
        xml_show.value = result.data;
      } else {
        ElMessage.error("载入失败");
      }
    } else {
      ElMessage.error("服务器error");
    }
  });
};
//载入配置文件到模型模块化耦合控制区操作面板
const confirmLoad = () => {    
  modelData.modelConfig.push({
    name: modelData.loadModel.name,
    oid:modelData.loadModel.oid,
    configName: modelData.loadModel.name + ".conf",
  });
  dialog.deployDocument = false;
};
//调用函数
const invoke = ()  =>{
  //根据文件oid，调用exe，生成最终结果，并可视化
  let form = new FormData();
  let oid = '', oids = [];
  for(let item of modelData.loadModels){
    if(oid !== item.oid){
      oid = item.oid;
      oids.push(oid);
    }
  }
  if(oids.length < 2){
    ElMessage({
      message:"模型数目不够2个，无法耦合",
      type:'error',
    })
  }else{
    form.append('oids', oids);
    load.loading = true;
    setTimeout(() => {
      isShow.value = true;
      load.loading = false;
    }, 1000)
  }
};
//配置文件下载函数
const downloadConfig = (oid) =>{
  console.log(`oid 为 ${oid}`);
  if(oid === undefined){
    ElMessage({message:'该配置文件无oid，请检查！', type:'error'});
  }
  let form = new FormData();
  form.append('oid',oid);
  load.downloadLoading = true;
  
  window.location.href = `/api/downloadConfig?oid=${oid}`;  
  load.downloadLoading = false;
};
//下载输出数据
const downloadOutput = () =>{
  if(selected.value === ''){
    ElMessage({message:"未选择需要下载的文件，请先选择待下载文件！", type:"error"})
    return;
  }
  //拼写出下载的文件路径
  let path = '';
  for(let item of output){
    if(item.value === selected.value){
      if(item.path === ''){
        path = outputPath.value + '/' + selected.value;
      }else{
        path = outputPath.value + '/' + item.path + '/' + selected.value;
      }          
      break;
    }
  }
  let form = new FormData();
  form.append('filePath', path);
  load.downloadFileLoading = true;
  //利用blob实现axios下载,超时时间五分钟
  axios.post('/api/downloadFile', form, {responseType:'blob'},{timeout:30000}).then(res => {
    load.downloadFileLoading = false;

    const content = res.data;
    const blob = new Blob([content]);
    if('download' in document.createElement('a')){
      //非IE下载
      const elink = document.createElement('a');
      elink.download = selected.value;
      elink.style.display = 'none';
      elink.href = window.URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      window.URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    }else{
      //IE10+下载
      if(typeof window.navigator.msSaveBlob !== 'undefined'){
        window.navigator.msSaveBlob(blob, selected.value);
      }else{
        let URL = window.URL || window.webkitURL;
        let downloadUrl = URL.createObjectURL(blob);
        window.location = downloadUrl;
      }
    }
  }).catch(err => {
    console.log(err);
  })      
};

const showMap = () => {
  router.push('/couple')
}
//#endregion

let selected = computed({
    get(){
        return value.value;
    },
    set(value){
        value.value = value;
    }
})
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
  overflow: auto !important;
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
.paragraph{
  text-align:left;
  font-style:italic;
  font-weight: 800;
}
</style>
