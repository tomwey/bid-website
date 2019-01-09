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
            path: '/help',
            name: 'help',
            component: () => import("@/pages/help/index")
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
                        requireApprove: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/company'),
                },
                {
                    path: 'man',
                    name: 'user_man',
                    meta: {
                        requireAuth: true,
                        requireApprove: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/man'),
                },
                {
                    path: 'area',
                    name: 'user_area',
                    meta: {
                        requireAuth: true,
                        requireApprove: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/area'),
                },
                {
                    path: 'servicetype',
                    name: 'user_service_type',
                    meta: {
                        requireAuth: true,
                        requireApprove: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/service-type'),
                },
                {
                    path: 'company_achievement',
                    name: 'user_company_achievement',
                    meta: {
                        requireAuth: true,
                        requireApprove: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/company-achievement'),
                },
                {
                    path: 'accounts',
                    name: 'user_account',
                    meta: {
                        requireAuth: true,
                        // requireApprove: true
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/account'),
                },
                {
                    path: 'edit_pwd',
                    name: 'user_change_pwd',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/password'),
                },
                {
                    path: 'bindmobile',
                    name: 'bind_mobile',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bind-mobile'),
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
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/other-info'),
                },
                {
                    path: 'other_attachments',
                    name: 'user_other_attachments',
                    meta: {
                        requireAuth: true,
                        requireApprove: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/other-attachments'),
                },
                {
                    path: 'profile',
                    name: 'profile',
                    meta: {
                        requireAuth: true,
                        needLoadProfile: true,
                    },
                    component: () => import('@/pages/user/profile')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    store.commit("getToken");
    if (to.matched.some(r => r.meta.requireAuth)) {
        let token = store.state.token;
        if (token) {
            if (to.meta.requireApprove) {
                // 需要供方填资料的路由，进入之前先去加载供方基本资料
                if (!store.state.supinfo.supid) {
                    // 还未录入资料
                    post({
                        action: "P_SUP_GetAccountSupInfo",
                        p1: store.state.supinfo.accountid,
                        p2: token
                    }, res => {
                        // console.log(res);
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

                        if (!store.state.supinfo.supid) {
                            next({
                                path: '/admin/profile'
                            });
                        } else {
                            // 
                            if (to.meta.needLoadProfile) {
                                // 提前加载供应商资料数据
                                loadProfile(store, () => {
                                    next();
                                });
                            } else {
                                next();
                            }

                            // next();

                        }
                    });
                } else {
                    // 已经录入过资料，直接放行
                    if (to.meta.needLoadProfile) {
                        // 提前加载供应商资料数据
                        loadProfile(store, () => {
                            next();
                        });
                    } else {
                        next();
                    }
                }
            } else {
                // 不需要供应商录入资料就可以进入的路由
                // 已经录入过资料，直接放行
                if (to.meta.needLoadProfile) {
                    // 提前加载供应商资料数据
                    loadProfile(store, () => {
                        next();
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

function loadProfile(_store, callback) {
    post({
        action: "getsupinfo",
        uid: _store.state.supinfo.accountid,
        token: _store.state.token
    }, res => {
        console.log("##### profile: ", res);
        if (res.code === "0") {
            _store.commit("updatesupprofile", res.data);
        }

        if (callback) {
            callback(res);
        }
    })
}

export default router;