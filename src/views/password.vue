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
                        <el-input v-model.trim="account" placeholder="请输入手机号" suffix-icon="el-icon-user" @keyup.enter.native='loginBtn' maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input type='password' v-model.trim="password" placeholder="请输入新密码" show-password suffix-icon="el-icon-lock" @keyup.enter.native='loginBtn'></el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input type='password' v-model.trim="repassword" placeholder="再次输入密码" show-password suffix-icon="el-icon-lock" @keyup.enter.native='loginBtn'></el-input>
                    </el-form-item>
                    <el-form-item prop="pass" class='yzm'>
                        <el-input v-model.trim="code" placeholder="请输入验证码" @keyup.enter.native='loginBtn' maxlength="6"></el-input>
                        <el-button type="primary" @click="sendCode" :disabled="disabled">{{sendText}}</el-button>

                    </el-form-item>
                    <el-button class="loginbtn" @click="loginBtn" :loading="btnLoading">{{loginBtnTit}}</el-button>

                </el-form>
                <div class="tabview">
                    <router-link to="/">去登录</router-link>
                </div>
            </div>
        </div>
        <div class="login_footer">©CopyRight 2023{{titleEnv}}</div>
    </div>
</template>
<script>
import { checkPhone, checkPwd, checkCode, message } from '@/utils/common.js';
import { getVerifyApi, resetPassword } from "@/api/index";

import '@/utils/jssm2.js'
import { JSSM3 } from '@/utils/jssm3.js'
const JSSM4 = require('@/utils/jssm4.js');
import { PUBLIC_KEY, TITLE_ENV } from '../../src/config/index.js'
export default {
    data() {
        return {
            account: "",
            password: "",
            repassword: "",
            code: "",
            imgCode: "",
            codeId: '',
            btnLoading: false,
            loginBtnTit: "重置密码",
            sendText: '点击发送',//发送验证码
            disabled: false,
            times: null,//定时器
            titleEnv: TITLE_ENV
        };
    },
    mounted() {
        // this.changeImgCode();

    },
    methods: {
        // 发送验证码
        sendCode() {
            if (!checkPhone(this.account)) {
                return;
            }
            let that = this;
            let time = 60;
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
            this.changeImgCode()

        },
        // 验证码
        async changeImgCode() {
            const promise = {
                mobile: this.account,
                type: 2
            }

            let id = Math.random().toString();
            let secret = JSSM3(id);
            let sm4 = new JSSM4(secret);
            let data = JSON.stringify(promise);
            let endata = sm4.encryptData_ECB(data);
            let sm2 = new JSSM2();
            sm2.setPublicKey(PUBLIC_KEY);

            let postdata = {
                "data": endata,
                "key": sm2.encrypt(secret),
            };
            this.btnLoading = true;
            // this.loginBtnTit = "正在登录...";
            const res = await this.axios.post(getVerifyApi, postdata)
            // console.log(res);
            this.btnLoading = false;
            if (res.data.code == 1) {
                this.btnLoading = false;
                // console.log(res)
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "success"
                });
            } else {
                message(res.data.msg);
                // this.clearInput();
                this.code = '';
                this.sendText = '点击发送';
                clearInterval(this.times);
                this.disabled = false;
            }
        },

        // 重置密码
        async loginBtn() {
            if (!checkPhone(this.account)) {
                return;
            }
            if (!checkPwd(this.password)) {
                return;
            }
            if (this.password != this.repassword) {
                message('重复密码不一致')
                return;
            }
            if (!checkCode(this.code)) {
                return;
            }
            const promise = {
                mobile: this.account,
                password: this.password,
                repassword: this.repassword,
                verify_code: this.code,
                id: this.codeId,
                ip: returnCitySN["cip"]
            }

            let id = Math.random().toString();
            let secret = JSSM3(id);
            let sm4 = new JSSM4(secret);
            let data = JSON.stringify(promise);
            let endata = sm4.encryptData_ECB(data);
            let sm2 = new JSSM2();
            sm2.setPublicKey(PUBLIC_KEY);

            let postdata = {
                "data": endata,
                "key": sm2.encrypt(secret),
            };
            this.btnLoading = true;
            const res = await this.axios.post(resetPassword, postdata)
            console.log(res);
            if (res.data.code == 1) {
                this.btnLoading = false;
                this.$message({
                    showClose: true,
                    message: res.data.data,
                    type: "success"
                });
                this.$router.push({ name: "login" });
            } else {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error"
                });
                this.btnLoading = false;
                // this.loginBtnTit = "登录";
                this.code = "";
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