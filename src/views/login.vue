<template>
    <div class="login">
        <div class="login_main">
            <div class="login_main_left">
                <img class="login_img" src="@/assets/img/login_input.jpg" alt />
            </div>
            <div class="login_main_right">
                <div :class="titleEnv.length>11?'login_title1':'login_title'">{{titleEnv}}</div>
                <el-form label-width="auto">
                    <el-form-item prop="pass">
                        <el-input v-model.trim="account" placeholder="请输入手机号" suffix-icon="el-icon-user" @keyup.enter.native='loginBtn' oninput="value=value.replace(/[^\w_]/g,'')" :minlength="4" :maxlength="18"></el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input type='password' v-model.trim="password" placeholder="请输入密码" show-password suffix-icon="el-icon-lock" @keyup.enter.native='loginBtn'></el-input>
                    </el-form-item>
                    <el-form-item prop="pass" class='yzm'>
                        <el-input v-model.trim="code" placeholder="请输入验证码" @keyup.enter.native='loginBtn' maxlength="4"></el-input>
                        <!-- <el-button type="primary" @click="sendCode" :disabled="disabled">{{sendText}}</el-button> -->
                        <span style="height: 40px;" @click="changeImgCode">
                            <img :src="imgCode" alt />
                        </span>

                    </el-form-item>
                    <el-button class="loginbtn" @click="loginBtn" :loading="btnLoading">{{loginBtnTit}}</el-button>

                </el-form>
                <div class="tabview">
                    <router-link to="password">忘记密码</router-link>
                </div>
            </div>
        </div>
        <div class="login_footer">©CopyRight 2023{{titleEnv}}</div>

        <dot-canvas />
        <rainbow />
    </div>
</template>
<script>
import { checkPhone, checkPwd, checkCode } from '@/utils/common.js';
import { loginApi } from "@/api/index";

import {baseUrl, TITLE_ENV} from '../../src/config/index.js'
import aes from "@/config/encrypt";
import DotCanvas from "@/components/dotCanvas.vue";
import Rainbow from "@/components/rainbow.vue";
export default {
    components: {Rainbow, DotCanvas},
    data() {
        return {
            account: "",
            password: "",
            code: "",
            imgCode: "",
            codeId: '',
            btnLoading: false,
            loginBtnTit: "登录",
            sendText: '点击发送',//发送验证码
            disabled: false,
            times: null,//定时器
            titleEnv: TITLE_ENV
        };
    },
    mounted() {
        // console.log(this.$route);
        this.changeImgCode();
    },
    methods: {
        // 发送验证码
        sendCode() {
            let that = this;
            // console.log('手机号为',this.account);
            let time = 10;
            that.sendText = time;
            that.disabled = true;
            that.times = setInterval(() => {
                time--;
                that.sendText = time;
                if (time == 0) {
                    time = 60;
                    that.sendText = '点击发送';
                    clearInterval(that.times);
                    that.disabled = false;
                }
            }, 1000);

        },
        // 验证码
        changeImgCode() {
            this.codeId = Math.ceil(Math.random() * 10111110);//生成一个随机数（防止缓存）
            this.imgCode = baseUrl + "/api/EntryCaptcha?id=" + this.codeId;
        },

        // 登录
        async loginBtn() {
            if (!(this.account && String(this.account).length > 4 && String(this.account).length < 18)) {
                this.$message({
                    showClose: true,
                    message: "登录账号格式错误",
                    type: "error"
                })
                return;
            }
            if (!checkPwd(this.password)) {
                return;
            }
            const promise = {
                username: this.account,
                password: this.password,
                captcha: this.code,
                id: this.codeId,
                ip: returnCitySN["cip"]
            }

            let postdata = aes.encrypt(promise);
            this.btnLoading = true;
            this.loginBtnTit = "正在登录...";
            // 中小学登录
            const res = await this.axios.post(loginApi,postdata)
            if (res.data.code == 1) {
                this.btnLoading = false;
                this.$message({
                    showClose: true,
                    message: "登录成功",
                    type: "success"
                });
                //在localstorage中储存用户名
                localStorage.setItem("token", res.data.data.token);
                this.$router.push({ name: "home" });
            } else {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error"
                });
                this.btnLoading = false;
                this.loginBtnTit = "登录";
                this.code = "";
                this.changeImgCode();//更新验证码
            }
        }
    },
};
</script>
<style>
.login .el-form-item__content {
    margin-left: 0px;
}
.login .el-input__icon {
    font-size: 18px;
}
.yzm .el-form-item__content {
    display: flex;
}

.yzm img {
    width: 130px;
    height: 40px;
}
</style>
<style lang='scss' scoped>
.login {
    width: 100vw;
    // height: 100vh;
    min-height: 100vh;
    background-image: url(../assets/img/logon_bg.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center; /*垂直居中*/
    justify-content: center; /*水平居中*/
    position: relative;
    z-index: 1;
    .login_main {
        width: 1000px;
        background: #fff;
        display: flex;
        .login_main_left {
            width: 580px;
            height: 560px;
            .login_img {
                width: 100%;
                height: 100%;
            }
        }

        .login_main_right {
            //  width: 420px;
            padding: 89px 46px 0 46px;
            flex: 1;

            .login_title {
                color: #000;
                font-size: 28px;
                text-align: center;
            }
            .login_title1 {
                color: #000;
                font-size: 25px;
                text-align: center;
            }
            .el-form {
                margin-top: 72px;
            }
            .loginbtn {
                width: 100%;
                background: #2f39ff;
                color: #fff;
                height: 44px;
            }
        }
    }
    .login_footer {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        text-align: center;
        color: #fff;
        font-size: 12px;
    }
}
.tabview {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
        color: #2f39ff;
    }
}
</style>
