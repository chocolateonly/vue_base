import Vue from "vue";
import Router from 'vue-router'
import mains from "@/views/mains.vue";

Vue.use(Router)

const routes = [
    {
        path: '/home',
        redirect: '/home',
        name: 'mains',
        component: mains,
        meta: {
            // title: '首页',
            requireAuth: true
        },
        children: [{
            path: '/home',
            name: 'home',
            component:  () => import('../views/index.vue'),
            meta: {
                requireAuth: true,
                title: '数据看板'
            }
        },]
    },
    {
        path: '/',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/password',
        name: 'password',
        component: () =>
            import('@/views/password')
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import('@/views/register')
    }

]
const router =new Router({
    history: 'history',
    routes, // `routes: routes` 的缩写
})

export default router