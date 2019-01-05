import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/home/index';
import funcs from '@/utils/funcs';
import store from '../store';

import post from '@/utils/ajax';

Vue.use(funcs);

Vue.use(Router);

const router = new Router({
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
                    component: () => import("@/pages/account/forget-password")
                },
                {
                    path: 'find_login',
                    name: 'find_login',
                    component: () => import("@/pages/account/find_login")
                }
            ]
        },
        {
            path: '/admin',
            component: () => import('@/pages/user/index'),
            children: [
                {
                    path: '',
                    name: 'user_home',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/home'),
                },
                {
                    path: 'messages',
                    name: 'user_messages',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/message'),
                },
                {
                    path: 'bids',
                    name: 'user_bid',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-list'),
                },
                {
                    path: 'bid_result',
                    name: 'user_bid_result',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-result'),
                },
                {
                    path: 'company',
                    name: 'user_company',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/company'),
                },
                {
                    path: 'man',
                    name: 'user_man',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/man'),
                },
                {
                    path: 'area',
                    name: 'user_area',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/area'),
                },
                {
                    path: 'servicetype',
                    name: 'user_service_type',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/service-type'),
                },
                {
                    path: 'company_achievement',
                    name: 'user_company_achievement',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/company-achievement'),
                },
                {
                    path: 'accounts',
                    name: 'user_account',
                    meta: {
                        requireAuth: true,
                        // requireApprove: true
                    },
                    component: () => import('@/pages/user/account'),
                },
                {
                    path: 'edit_pwd',
                    name: 'user_change_pwd',
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('@/pages/user/password'),
                },
                {
                    path: 'loginlog',
                    name: 'user_login_log',
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('@/pages/user/login-log'),
                },
                {
                    path: 'other_info',
                    name: 'user_other_info',
                    meta: {
                        requireAuth: true,
                        requireApprove: true,
                    },
                    component: () => import('@/pages/user/other-info'),
                },
                {
                    path: 'other_attachments',
                    name: 'user_other_attachments',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/other-attachments'),
                },
                {
                    path: 'profile',
                    name: 'profile',
                    meta: {
                        requireAuth: true
                    },
                    component: () => import('@/pages/user/profile')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    // console.log(from);
    store.commit("getToken");
    if (to.matched.some(r => r.meta.requireAuth)) {

        let token = store.state.token;
        if (token) {
            if (!store.state.supinfo.loginname) {
                post({
                    action: "P_SUP_GetAccountSupInfo",
                    p1: store.state.supinfo.accountid,
                    p2: token
                }, res => {
                    console.log(res);
                    if (res.code === "0") {
                        // store.state.supinfo = 
                        let arr = res.data;
                        if (arr.length > 0) {
                            store.commit("updatesupinfo", arr[0]);
                        }
                    } else {
                        store.commit("logout");
                        next({
                            path: '/',
                            query: { redirect: to.fullPath }
                        });
                    }

                    if (to.meta.requireApprove && !store.state.supinfo.supid) {
                        next({
                            path: '/admin/profile'
                        });
                    } else {
                        next();
                    }
                });
            } else {
                // console.log(store.state.supinfo);
                if (to.meta.requireApprove && !store.state.supinfo.supid) {
                    next({
                        path: '/admin/profile'
                    });
                } else {
                    next();
                }
            }
        } else {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }
});

export default router;