 <template>
    <div class="nav nav_list">
        <el-row class="tac">
            <div class="header-img">
                <span class="title" v-if="!isCollapse">{{titleEnv}}</span>
                <span class="title2" v-else><img class="login_img" src="@/assets/img/logo.png" alt /></span>
                <img class="zdBtn" src="@/assets/img/zdBtn.png" alt @click="zdBtn" v-if="!isCollapse" />
                <img class="zdBtn" src="@/assets/img/zdBtn2.png" alt @click="zdBtn" v-else />
            </div>

            <!-- 内部div -->
            <!-- background-color="#20222a" -->
            <el-menu router :default-active="$route.path" unique-opened class="el-menu-vertical-demo ysMain" :collapse-transition='false' :collapse="isCollapse" text-color="#fff" active-text-color="#ffffff">
                <template v-for="(item,index) in submenuList">
                    <!-- 一级菜单（没有任何子级菜单）-->
                    <el-menu-item :index="item.path" v-if="!item.children" :key="index">
                        <!-- {{item[meta][icon]}} -->
                        <i :class="item.icon"></i> <span>{{item.title}}</span>
                    </el-menu-item>
                    <!-- 一级菜单（有子级菜单）-->
                    <el-submenu :index="item.path" v-else :key="index">
                        <template slot="title"><i :class="item.icon"></i> <span>{{item.title}}</span></template>
                        <!-- 遍历二级菜单容器 -->
                        <template v-for="(i,index) in item.children">
                            <!-- 判断二级菜单（没有三级菜单）-->
                            <el-menu-item :index="i.path" v-if="!i.children" :key="index" style="background-color='#ccc'">{{i.title}}</el-menu-item>

                            <!-- 判断二级菜单（有三级菜单）-->
                            <el-submenu :index="i.path+'-'+index" v-if="i.children" :key="index">
                                <template slot="title">{{i.title}}</template>
                                <el-menu-item :index="j.path" v-for="(j,index) in i.children" :key="index">{{j.title}} </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-submenu>
                </template>
            </el-menu>
        </el-row>
    </div>
</template>
<script>
import { TITLE_ENV } from '../../src/config/index.js'
import { nodesApi } from "@/api/index";
export default {
    data() {
        return {
            openeds: [""],
            routePath: "1",
            submenuList: [],
            isCollapse: false,
            titleEnv: TITLE_ENV,
            menuList: [],
        };
    },
    created() {
        this.getNodelList();
    },
    mounted() {
        this.routePath = this.$route.path;
    },
    methods: {
        zdBtn() {
            if (this.isCollapse) {
                this.isCollapse = false
            } else {
                this.isCollapse = true
            }

        },
        //获取导航列表
        async getNodelList11() {
            let datas = {
                node_type: 0
            }
            if (!localStorage.getItem('token')) {
                return;
            }
            const res = await this.axios.post(nodesApi, datas)
            if (res.data.code == 1) {
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
        //获取导航列表
        async getNodelList() {
            await this.getNodelList11()
            const menuList = this.menuList
            const menuRouters = []
            // 先取出根节点，没有父id的就是根节点
            menuList.forEach((m, i) => {
                if (m.vue_display == 1) {
                    if (m.parent_id === 0) {
                        const module = {
                            path: m.router_path,
                            //   component: Layout,
                            redirect: 'noRedirect',
                            name: m.node_name,
                            title: m.node_name,
                            icon: m.icon,
                            meta: { id: m.id, title: m.title, icon: m.icon }
                        }
                        if (chkTree(m.id)) {
                            module.children = [
                                {
                                    path: '',
                                    component: () => import(`@/views/${m.router_path}/index`),
                                    meta: {
                                        title: m.title
                                    }
                                }
                            ]
                            module.children.splice(0, 1)
                        }
                        menuRouters.push(module)
                    }
                }
            })
            // 定义一个递归方法
            function convertTree(routers) {
                routers.forEach(r => {
                    menuList.forEach((m, i) => {
                        if (m.vue_display == 1) {
                            if (m.parent_id && m.parent_id === r.meta.id) {
                                if (!r.children) r.children = []
                                m.fullPath = r.meta.fullPath + '/' + m.path
                                const tmp = r.path + '/' + m.router_path + '/index'
                                const menu = {
                                    path: m.router_path,
                                    component: () => import(`@/views${tmp}`),
                                    name: m.node_name,
                                    title: m.node_name,
                                    meta: { id: m.id, title: m.title }
                                }
                                r.children.push(menu)
                            }
                        }
                    })
                    if (r.children) convertTree(r.children)
                })
            }
            // 检查根节点下是否有子节点
            function chkTree(id) {
                var tmp = false
                menuList.forEach((m, i) => {
                    if (m.vue_display == 1) {
                        if (m.parent_id && m.parent_id === id) {
                            tmp = true
                        }
                    }
                })
                return tmp
            }
            convertTree(menuRouters) // 用递归填充
            this.submenuList = menuRouters;
            //   menuRouters = 路由数据
        },
    }
};
</script>
<style>
.ysMain .el-submenu .el-menu {
    background: #16181d !important;
}
.el-menu--vertical .el-menu--popup {
    background: #16181d !important;
}
.el-menu-item:hover,
.el-menu-item:focus {
    background-color: #121314 !important;
}
.tac .el-submenu__title:hover {
    background-color: #121314 !important;
}

.el-submenu.is-active .el-submenu__title:hover {
    background-color: #121314 !important;
}

.el-menu-item.is-active {
    background-color: #2f39ff !important;
    color: #fff;
}

.el-menu--popup-right-start .el-submenu__title:hover {
    background-color: #121314 !important;
}
</style>

<style lang="scss" scoped>
.nav {
    .tac {
        height: calc(100vh - 48px);
        // .el-menu{
        //     height: calc(100vh - 48px);
        // }
        .el-menu {
            height: calc(100vh - 48px);
            box-shadow: 2px 0px 6px 0px rgba(92, 128, 255, 0.16);
            border-right: none;
            overflow-y: auto;
            background-color: #20222a;
        }

        .el-menu::-webkit-scrollbar {
            display: none;
        }
        .el-menu-item i,
        .el-submenu__title i {
            color: #fff !important;
        }
    }
    // width: 240px;

    .header-img {
        .zdBtn {
            position: relative;
            left: 30px;
            cursor: pointer;
        }
        // width: 240px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background-color: #20222a;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
        .title {
            font-size: 18px;
            color: #fff;
            padding: 0 11px;
            font-weight: 600;
        }
        .title2 {
            position: relative;
            top: 6px;
            left: 10px;
            .login_img {
                width: 30px;
                height: 30px;
            }
        }
    }
}
</style>
