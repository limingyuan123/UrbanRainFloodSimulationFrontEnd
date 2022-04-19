<template>
    <div  id="container">
        <div class="navbar">
            <navbar></navbar>
        </div>
        <el-form
                :rules="rules"
                ref="loginForm"
                v-loading="loading"                
                :model="loginForm"
                class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>            
            <el-checkbox size="normal" class="loginRemember" v-model="checked">记住用户名与密码</el-checkbox>
            <div class="loginButton">
                <el-button class="login" size="normal" type="primary" @click="submitLogin">登录</el-button>
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

<script>
    import Navbar  from '../components/Navbar';
    import { mapMutations } from 'vuex';
    export default {
        name: "Login",
        components:{
            Navbar,

        },
        data() {
            return {
                loading: false,
                vcUrl: '/verifyCode?time='+new Date(),
                loginForm: {
                    username: '',
                    password: '',
                    code:''
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
                }
            }
        },
        methods: {
            ...mapMutations(['setLogin', 'setIndex']),
            updateVerifyCode() {
                this.vcUrl = '/verifyCode?time='+new Date();
            },
            submitLogin() {
                let _this = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        _this.loading = true;
                        var userJson = {};
                        userJson["name"] = _this.loginForm.username;
                        userJson["password"] = _this.loginForm.password;
                        _this.axios
                            .post("/api/login", userJson)
                            .then(res => {
                                let data = res.data;
                                if(data.code == 0){
                                    //存储到state中
                                    _this.setLogin({Authorization:data.data.uid, userName:data.data.account})
                                    _this.setIndex('1');
                                    _this.$router.replace('/home');
                                }else{
                                    _this.$message({message:`登陆失败，${data.message}`, type:'error'})
                                    _this.loading = false;
                                }
                            })
                    }
                    else {
                        return false;
                    }
                });
            }

        }
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