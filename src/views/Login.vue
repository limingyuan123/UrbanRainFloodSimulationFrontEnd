<template>
    <div  id="container">
        <div class="navbar">
            <navbar></navbar>
        </div>
        <el-form
                :rules="rules"
                ref="formRef"
                v-loading="loading"                
                :model="loginForm"
                class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="username" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>            
            <el-checkbox size="normal" class="loginRemember" v-model="checked">记住用户名与密码</el-checkbox>
            <div class="loginButton">
                <el-button class="login" size="normal" type="primary" @click="submitLogin(formRef)">登录</el-button>
                <el-button class="register" size="normal">
                    <router-link to="register" custom v-slot="{ navigate }">
                        	<span @click="navigate" @keypress.enter="navigate" role="link">
                               注册
                            </span>
                    </router-link>
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import Navbar  from '../components/Navbar';
import { useStore } from 'vuex';
import { reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus/lib/components';
import { FormInstance } from 'element-plus';
const store = useStore();
const router = useRouter();
let loading = ref(false);
let formRef = ref();
let vcUrl = ref('/verifyCode?time='+new Date());
let loginForm = reactive({
    username: '',
    password: '',
    code:''
});
let {username, password, code} = toRefs(loginForm);
let checked = ref(true);
let rules = {
    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
    password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
}
const updateVerifyCode = () => {
    vcUrl.value = '/verifyCode?time='+new Date();
};
const submitLogin = (login) => {
    login.validate((valid) => {
        if (valid) {
            loading.value = true;
            var userJson = {};
            userJson["name"] = loginForm.username;
            userJson["password"] = loginForm.password;
            axios
                .post("/api/login", userJson)
                .then(res => {
                    let data = res.data;
                    if(data.code == 0){
                        //存储到state中
                        store.commit('setLogin', {Authorization:data.data.uid, userName:data.data.account});
                        store.commit('setIndex', '1');
                        router.push('/home');
                    }else{
                        ElMessage({message:`登陆失败，${data.message}`, type:'error'})
                        loading.value = false;
                    }
                })
        }
        else {
            return false;
        }
    });
}
</script>
<style scoped>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 100px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
    .el-form-item__content{
        display: flex;
        align-items: center;
    }
    #container{
        /*保证footer是相对于container位置绝对定位*/
        position:relative;  
        width:100%;
        min-height:100%; 
        /*设置padding-bottom值大于等于footer的height值，以保证main的内容能够全部显示出来而不被footer遮盖；*/  
        padding-bottom: 100px;  
        box-sizing: border-box;
    }
    .login{
        flex:40%;
        margin-right:20px;
    }
    .register{
        flex:40%;
    }
    
    .loginButton{
        display:flex;
        height:50px;
    }
</style>