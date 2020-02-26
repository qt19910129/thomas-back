<template>
    <div class="login">
        <div class="main">
            <div class="fl">
                <img src="../../static/img/common/loginImg.png" class="loginImg">
            </div>
            <div class="fr">
                <div class="loginTitle">托马斯校区管理系统</div>
                <el-row type="flex" justify="center">
                    <el-form ref="loginForm" :model="user" :rules="rules" status-icon label-width="80px">
                        <el-form-item prop="name">
                            <el-input v-model.trim="user.name" placeholder="请输入用户名" class="user"></el-input>
                        </el-form-item>
                        <el-form-item prop="pass">
                            <el-input v-model.trim="user.pass" type="password" placeholder="请输入密码" class="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="code">
                            <el-input v-model.trim="user.code" placeholder="请输入验证码" class="code" :maxlength="4"></el-input>
                            <img :src="codeSrc" class="codeImg" @click="getCode()">
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-upload" @click="login" class="land">立即登录</el-button>
                        </el-form-item>
                        <el-form-item>
                            <div class="tips">忘记密码请联系总部管理员</div>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        userLogin
    } from "../../axios/login";
    export default {
        inject:['reload'],
        data () {
            return {

                loginForm: {
                    name:'',
                    pass:'',
                    code:''
                },
                user: {},
                rules: {
                    name: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    pass: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ],
                },
                codeSrc:''
            }
        },
        mounted() {
            this.getCode();
            let that = this;
            document.onkeydown = function (e) { // 回车提交表单
                // 兼容FF和IE和Opera
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    that.login();
                }
            }
        },
        methods: {
            getCode() {  //获取验证码图片
                this.codeSrc = 'http://admin.thomasbk.com:9007' + '/school/index/verificationCode?timer=' + new Date();
            },
            login() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        let data = {
                            'userName':this.user.name,
                            'password':this.user.pass,
                            'vCode':this.user.code
                        };
                        userLogin(data).then(res => {
                            if(res.code == 0) {
                                localStorage.clear();
                                localStorage.setItem('token', res.data);
                                localStorage.setItem('teacherName', this.user.name);
                                this.$message({
                                    message: '欢迎你,' + this.user.name + '!',
                                    type: 'success'
                                });
                                // this.$notify({
                                //     type: 'success',
                                //     message: '欢迎你,' + this.user.name + '!',
                                //     duration: 3000
                                // });
                                let that = this;
                                setTimeout(function () {
                                    // window.open(that.GLOBAL.domain+'/#/content/pageIndex');
                                    // that.closeWindow();
                                    that.$router.push({
                                        path: `/content/pageIndex`,
                                    })
                                },1000);
                            } else if(res.code == 20001) {
                                this.$message.error('验证码填写错误，请重新输入');
                                this.getCode();
                            } else if(res.code == 20002) {
                                this.$message.error('用户名或密码填写错误，请重新输入');
                                this.getCode();
                            } else {
                                this.$message.error('网络异常，请稍后再试');
                                this.getCode();
                            }
                        }).catch((e) => {});
                    }
                    else {
                        return false
                    }
                })
            },
            closeWindow() {
                var browserName = navigator.appName;
                if (browserName == "Netscape") {
                    window.open('', '_self', '');
                    window.close();
                }
                else {
                    if (browserName == "Microsoft Internet Explorer") {
                        window.open('', '_parent', '');
                        window.close();
                    }
                }
            }
        },
    }
</script>

<style scoped lang="less">
    .login{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: #3787F5;
        .main{
            width: 1200px;
            height: 620px;
            background: #fff;
            border-radius: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: -310px;
            margin-left: -600px;
            box-shadow: 0px 0px 20px 10px #305EB1;
            >div{
                width: 50%;
                height: 100%;
                overflow: hidden;
            }
            .loginImg{
                margin: 70px 0 0 60px;
                width: 450px;
            }
            .loginTitle{
                margin: 70px 0 50px 0;
                width: 100%;
                text-align: center;
                font-size: 28px;
                line-height: 28px;
            }
            .land{
                width: 440px;
                height: 50px;
                font-size: 16px;
            }
            .tips{
                width: 440px;
                text-align: center;
                color: orangered;
            }
        }
        .code{
            width: 316px;
        }
        .codeImg{
            width: 100px;
            height: 50px;
            display: inline-block;
            margin: -4px 0 0 20px;
        }
    }
</style>