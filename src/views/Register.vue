<template>
    <div  id="container">
        <div class="navbar">
            <navbar></navbar>
        </div>
        <el-form
                :rules="rules"
                ref="formRef"
                v-loading="loading"
                :model="registerForm"
                class="registerContainer">
            <h3 class="registerTitle">系统注册</h3>
            <el-form-item prop="email">
                <el-input size="normal" type="text" v-model="email" auto-complete="off"
                          placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="username" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input size="normal" type="password" v-model="confirmPassword" auto-complete="off"
                          placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <div class="registerButton">
                <el-button class="login" size="normal" type="primary" plain>
                    <router-link to="/login" custom v-slot="{ navigate }">
                        <span @click="navigate" @keypress.enter="navigate" role="link">
                            <el-icon style="margin-right:5px;"><back /></el-icon>登录
                        </span>
                    </router-link>
                </el-button>
                <el-button class="reset" size="normal" @click="resetRegister">重置</el-button>
                <el-button class="register" size="normal" type="primary" @click="submitRegister(formRef)">注册</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>    
import Navbar  from '../components/Navbar'
import { Back } from '@element-plus/icons-vue'
import { reactive, ref,toRefs } from 'vue';
import {useRouter} from 'vue-router'
import { useStore } from 'vuex';
import axios from 'axios';
const router = useRouter();
const store = useStore();
const {setLogin:[setLogin]} = store._mutations;
const {setIndex:[setIndex]} = store._mutations;
let loading = ref(false);
let vcUrl = ref('/verifyCode?time='+new Date());
let checked = ref(true);
let formRef = ref();
let registerForm = reactive({
    email:"",
    username:"",
    password:"",
    confirmPassword:""
});
let {email,username,password,confirmPassword} = toRefs(registerForm);
let rules = {
    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
    email: [{required: true, message: '邮箱不能为空', trigger: 'blur'}],
    password: [{required: true, message: '密码不能为空', trigger: 'blur'}],                    
    confirmPassword: [{required: true, message: '密码不能为空', trigger: 'blur'}],                    
};
const updateVerifyCode = () => {
    vcUrl.value = '/verifyCode?time='+new Date();
};
const submitRegister = (formRef) => {
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            let userJson = {};
            userJson["name"] = registerForm.username;
            userJson["email"] = registerForm.email;
            userJson["password"] = registerForm.password;
            axios
                .post("/api/register", userJson)
                .then(res => {
                    let data = res.data;
                    if(data.code == 0){
                        router.push('/login')
                    }else{
                        alert("error");
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
    .registerContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 100px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .registerTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .registerRemember {
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
    .registerButton{
        display:flex;
        height:50px;
    }
    .login{
        flex:30%;
        margin-right:20px;
        padding:0px;
    }
    .reset{
        flex:30%;
        margin-right:20px;
    }
    .register{
        flex:30%;
    }
</style>