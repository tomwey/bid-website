import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home/index';

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: () => import("@/pages/about/index")
        },
        {
            path: '/bid_plan',
            name: 'plan',
            component: () => import("@/pages/bid-plan/index")
        },
        {
            path: '/bid_notice',
            name: 'notice',
            component: () => import("@/pages/bid-notice/index")
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import("@/pages/contact/index")
        },
        {
            path: '/partner',
            name: 'partner',
            component: () => import("@/pages/partner/index")
        },
        // {
        //     path: '/sign_up',
        //     name: 'register',
        //     component: () => import("@/pages/register/index")
        // },
        {
            path: '/account',
            component: () => import('@/pages/account/index'),
            children: [
                {
                    path: 'sign_up',
                    name: 'register',
                    component: () => import("@/pages/account/register")
                },
                {
                    path: 'forget_pwd',
                    name: 'forget_pwd',
                    component: () => import("@/pages/user/password")
                },
                {
                    path: 'find_login',
                    name: 'find_login',
                    component: () => import("@/pages/account/find_login")
                }
            ]
        },
        {
            path: '/user/:id',
            component: () => import('@/pages/user/index'),
            children: [
                {
                    path: '',
                    name: 'user_home',
                    component: () => import('@/pages/user/home'),
                },
                {
                    path: 'messages',
                    name: 'user_messages',
                    component: () => import('@/pages/user/message'),
                },
                {
                    path: 'bids',
                    name: 'user_bid',
                    component: () => import('@/pages/user/bid-list'),
                },
                {
                    path: 'bid_result',
                    name: 'user_bid_result',
                    component: () => import('@/pages/user/bid-result'),
                },
                {
                    path: 'company',
                    name: 'user_company',
                    component: () => import('@/pages/user/company'),
                },
                {
                    path: 'man',
                    name: 'user_man',
                    component: () => import('@/pages/user/man'),
                },
                {
                    path: 'area',
                    name: 'user_area',
                    component: () => import('@/pages/user/area'),
                },
                {
                    path: 'servicetype',
                    name: 'user_service_type',
                    component: () => import('@/pages/user/service-type'),
                },
                {
                    path: 'company_achievement',
                    name: 'user_company_achievement',
                    component: () => import('@/pages/user/company-achievement'),
                },
                {
                    path: 'accounts',
                    name: 'user_account',
                    component: () => import('@/pages/user/account'),
                },
                {
                    path: 'edit_pwd',
                    name: 'user_change_pwd',
                    component: () => import('@/pages/user/password'),
                },
                {
                    path: 'loginlog',
                    name: 'user_login_log',
                    component: () => import('@/pages/user/login-log'),
                },
                {
                    path: 'other_info',
                    name: 'user_other_info',
                    component: () => import('@/pages/user/other-info'),
                },
                {
                    path: 'other_attachments',
                    name: 'user_other_attachments',
                    component: () => import('@/pages/user/other-attachments'),
                },
            ]
        }
    ]
});