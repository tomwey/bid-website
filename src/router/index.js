import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home/index';
import About from '../pages/about/index';
import Contact from '../pages/contact/index';
import Partner from '../pages/partner/index';
import Register from '../pages/register/index';

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
            component: About
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact
        },
        {
            path: '/partner',
            name: 'partner',
            component: Partner
        },
        {
            path: '/sign_up',
            name: 'register',
            component: Register
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
            ]
        }
    ]
});