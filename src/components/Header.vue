<template>
    <div class="header">
        <div class="header-content">
            <div class="login-content">

                <div class="rights">
                    <img class="user" src="@/assets/img/user.png" alt />
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{ inputName }}
                            <i class="iconfont el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in roleIds" :key="item.id" @click.native="jueseClick(item.id)">{{item.role_name}}</el-dropdown-item>
                            <el-dropdown-item @click.native="updataPasswordBtn">修改密码</el-dropdown-item>
                            <el-dropdown-item @click.native="goOld">校务管理系统</el-dropdown-item>
                            <el-dropdown-item @click.native="logOut('logout')">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>

        <!-- 新增编辑弹窗 -->
        <el-dialog title="修改密码" :visible.sync="dialogVisible" v-dialogDrag width="450px" v-if="dialogVisible" :close-on-click-modal="false" @close="handleClose">
            <el-form :model="formData" ref="formData" :rules="rule" status-icon label-width="100px" class="demo-ruleForm">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input type="password" v-model="formData.oldPassword" placeholder="请输入原密码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="newPasswordS">
                    <el-input type="password" v-model="formData.newPasswordS" placeholder="请再次输入新密码" autocomplete="off"></el-input>
                </el-form-item>
                <div style="text-align: center">
                    <el-button type="primary" class="btn" @click="submitForm('formData')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import '@/utils/jssm2.js'
import { JSSM3 } from '@/utils/jssm3.js'
const strs = require('@/utils/jssm4.js');
const JSSM4 = strs.JSSM4;
import { PUBLIC_KEY } from '../../src/config/index.js'
import { logOutApi, switchUserRolesApi, modifyPasswordApi } from "@/api/index";
export default {
    props: [
        'inputName', 'roleIds'
    ],
    data() {
        var oldPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入原密码'));
            } else {
                if (this.formData.oldPassword !== '') {
                    this.$refs.formData.validateField('oldPassword');
                }
                callback();
            }
        };

        var newPasswordS = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formData.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            dialogVisible: false,
            username: "",
            title: "",
            formData: {
                oldPassword: '',
                newPassword: "",
                newPasswordS: '',
            },
            rule: {
                oldPassword: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { min: 8, message: '密码必须大于8位', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 8, message: '密码必须大于8位', trigger: 'blur' }
                ],
                newPasswordS: [
                    { required: true, validator: newPasswordS, trigger: 'blur' },
                    { min: 8, message: '密码必须大于8位', trigger: 'blur' }
                ],
            },
        };
    },
    mounted() {
    },
    methods: {
        handleClose() {
            this.$refs['formData'].resetFields();
        },
        updataPasswordBtn() {
            this.dialogVisible = true;
        },
        // 修改密码确认
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let promise = {
                        old_password: this.formData.oldPassword,
                        password: this.formData.newPassword,
                        password_confirm: this.formData.newPasswordS,
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

                    const res = await this.axios.post(modifyPasswordApi, postdata)
                    if (res.data.code == 1) {
                        this.$refs['formData'].resetFields();
                        this.dialogVisible = false;
                        this.$message({
                            showClose: true,
                            message: '修改密码成功!',
                            type: "success"
                        });
                        setTimeout(() => {
                            localStorage.removeItem("token"); //清除token
                            localStorage.clear()
                            this.$router.push({ name: "login" });
                        }, 1000);

                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 切换角色
        async jueseClick(e) {
            let datas = {
                role_id: e,
            }
            const res = await this.axios.post(switchUserRolesApi, datas)
            if (res.data.code == 1) {
                this.$message({
                    showClose: true,
                    message: '角色切换成功',
                    type: "success"
                });
                this.$router.push("/home");
                this.$router.go(0);

            } else {
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error"
                });
            }
        },
        //去旧版
        goOld() {
            window.open(process.env.UPLOADER_URL + 'admin/pages/index.html?token=' + encodeURIComponent(localStorage.getItem("token")), '_blank')
        },
        //登出
        async logOut() {
            const res = await this.axios.post(logOutApi)
            if (res.data.code == 1) {
                localStorage.removeItem("token"); //清除token
                localStorage.clear()
                this.$router.push({ name: "login" });
            } else {
                this.$router.push({ name: "login" });
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error"
                });
            }
        },
    }
};
</script>
<style lang="scss" scoped>
// 头部样式
.header {
    font-family: 'ArialMT';
    width: 100%;
    height: 48px;
    margin-bottom: 2px;
    background: #fff;
    box-shadow: 0px 1px 0px 0px #f2f2f2;

    .header-content {
        font-size: 18px;
        display: flex;
        .login-content {
            min-width: 140px;
            height: 48px;
            line-height: 48px;
            padding-right: 0px;
            overflow: hidden;
            flex: 1;
            .rights {
                float: right;
                margin-right: 20px;
                .user {
                    position: relative;
                    top: 9px;
                }
            }

            .el-dropdown-link {
                width: 46px;
                height: 40px;
                font-size: 16px;
                font-family: ArialMT;
                font-weight: 400;
                color: #333333;
                line-height: 40px;
                margin: 0 6px;
            }
        }
    }
    .btn {
        margin-top: 20px;
        width: 250px;
    }
}
</style>


