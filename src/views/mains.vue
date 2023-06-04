<template>
    <div class="wrapper">
        <div style="display: flex">
            <NavList v-if="navShow"></NavList>
            <div class="containt">
                <Header v-if="navShow" :inputName="admin" :roleIds="roleIds"></Header>
                <tags />
                <router-view />
            </div>
            <el-dialog title="修改密码" v-dialogDrag :visible.sync="dialogVisible" width="450px" v-if="dialogVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
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
    </div>
</template>


<script>
import Header from "@/components/Header";
import NavList from "@/components/Navlist";
import { nodesApi, modifyPasswordApi } from "@/api/index";
import '@/utils/jssm2.js'
import { JSSM3 } from '@/utils/jssm3.js'
const JSSM4 = require('@/utils/jssm4.js');
import { PUBLIC_KEY } from '../../src/config/index.js'
import bus from '@/utils/bus';
import tags from '@/components/tags.vue';
export default {
    data() {
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
            navShow: true,
            menuList: [],
            admin: "",
            roleIds: [],
            dialogVisible: false,
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
            tagsList: [],
        };
    },
    components: {
        Header,
        NavList,
        tags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    mounted() {
        if (
            this.$route.path === "/" ||
            this.$route.path === "/login" ||
            this.$route.path === "/password" ||
            this.$route.path === "/register"
        ) {
            this.navShow = false;
        } else {
            this.navShow = true;
            this.getNodelList();
        }
    },

    methods: {
        //获取导航列表
        async getNodelList() {
            let datas = {
                node_type: 0
            }
            if (!localStorage.getItem('token')) {
                return;
            }
            const res = await this.axios.post(nodesApi, datas)
            if (res.data.code == 1) {
                localStorage.setItem('kaer_url', JSON.stringify(res.data.data.kaer_url))
                this.admin = res.data.data.role_name;
                this.roleIds = res.data.data.role_ids;
                this.menuList = res.data.data.nodes; // 后端的菜单数据
                if (res.data.data.refresh_pass == 0) {
                    this.dialogVisible = true;
                }
            } else {
                localStorage.removeItem("token");
                localStorage.clear()
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: "error"
                });
            }
        },
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
    },
    watch: {
        $route(to, form) {
            if (to.path === "/" ||
                to.path === "/login" ||
                to.path === "/password" ||
                to.path === "/register"
            ) {
                this.navShow = false;
            } else {
                this.navShow = true;
            }
        }
    }
};
</script>
<style>
.nav_list .el-menu-item-group__title {
    padding: 0px;
}
</style>

<style lang="scss" >
a {
    text-decoration: none !important;
}
.el-table th {
    display: table-cell !important;
}
.yzm .el-button {
    width: 98px;
}
</style>

