import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/home/index';
import funcs from '@/utils/funcs';
import store from '../store';

import post from '@/utils/ajax';
import { Message, MessageBox } from 'element-ui';

Vue.use(funcs);

Vue.use(Router);

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        // savedPosition is only available for popstate navigations.
        return savedPosition
    } else {
        const position = {}
        // new navigation.
        // scroll to anchor by returning the selector
        // console.log(to.hash);
        if (to.hash) {
            position.selector = to.hash
        }
        // check if any matched route config has meta that requires scrolling to top
        if (/*to.matched.some(m => m.meta.scrollToTop)*/
            !to.hash) {
            // cords will be used if no selector is provided,
            // or if the selector didn't match any element.
            position.x = 0
            position.y = 0
        }
        // if the returned position is falsy or an empty object,
        // will retain current scroll position.
        return position
    }
}

const router = new Router({
    mode: "history",
    scrollBehavior,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about#company',
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
            path: '/bid_notice/:id',
            name: 'notice-detail',
            component: () => import("@/pages/bid-notice/detail")
        },
        {
            path: '/help',
            name: 'help',
            component: () => import("@/pages/help/index")
        },
        {
            path: '/partner#intro',
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
                    path: 'messages/:id',
                    name: 'user_messages_detail',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/message-detail'),
                },
                {
                    path: 'apply-notify',
                    name: 'user_apply_notify',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-notify-list'),
                },
                {
                    path: 'applying-bids',
                    name: 'user_apply',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/apply-list'),
                },
                {
                    path: 'my-bids/:id',
                    name: 'user_apply_detail',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/apply-detail'),
                },
                {
                    path: 'applied-bids',
                    name: 'user_applied',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-list'),
                },
                {
                    path: 'apply-bid/:id',
                    name: 'user_apply_bid_detail',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-apply-detail'),
                },
                {
                    path: 'bids',
                    name: 'user_bids',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-list'),
                },
                {
                    path: 'bid-faq',
                    name: 'user_bid_faq',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-list'),
                },
                {
                    path: 'bid-result',
                    name: 'user_bid_result',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-list'),
                },
                {
                    path: 'bids/:id',
                    name: 'user_bid_detail',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/bid-detail'),
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
                    path: 'feedback',
                    name: 'user_report',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/feedback'),
                },
                {
                    path: 'survey',
                    name: 'user_survey',
                    meta: {
                        requireAuth: true,
                        requireApprove: true
                    },
                    component: () => import('@/pages/user/survey'),
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
                    component: () => import('@/pages/user/profile-refactor')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    store.commit("getToken");
    if (to.path !== '/admin/profile') {
        store.commit("set_draft_alert", false);
    }

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
                                // console.log(to.path);
                                // 提前加载供应商资料数据
                                loadProfile(to.path, store, () => {
                                    next();
                                });

                            } else {
                                next();
                            }
                        }
                    });
                } else {
                    // 已经录入过资料，直接放行
                    if (to.meta.needLoadProfile) {
                        // 提前加载供应商资料数据
                        loadProfile(to.path, store, () => {
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
                    loadProfile(to.path, store, () => {
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

function loadDraftProfile(_store, callback) {
    post(
        {
            action: "P_SUP_GetSupDraft",
            p1: _store.state.supinfo.accountid,
            p2: _store.state.token
        },
        res => {
            if (res.code === "0") {
                // console.log(res);
                const item = res.data[0];

                if (item.code === "0") {
                    // 有草稿
                    if (_store.state.has_draft_alert) {
                        post(
                            {
                                action: "getsupdraftinfo",
                                uid: _store.state.supinfo.accountid,
                                token: _store.state.token,
                                subid: item.subid
                            },
                            res => {
                                // console.log(res);
                                if (res.code === "0") {
                                    _store.commit("updatesupprofile", res.data);

                                    callback();
                                } else {
                                    Message({
                                        message: res.codemsg,
                                        type: "error"
                                    });
                                    callback();
                                }
                            }
                        );
                    } else {
                        MessageBox({
                            message: "之前有保存草稿，是否加载草稿？",
                            title: "提示",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                _store.commit("set_draft_alert", true);
                                post(
                                    {
                                        action: "getsupdraftinfo",
                                        uid: _store.state.supinfo.accountid,
                                        token: _store.state.token,
                                        subid: item.subid
                                    },
                                    res => {
                                        // console.log(res);
                                        if (res.code === "0") {
                                            _store.commit("updatesupprofile", res.data);

                                            callback();
                                        } else {
                                            Message({
                                                message: res.codemsg,
                                                type: "error"
                                            });
                                            callback();
                                        }
                                    }
                                );
                            })
                            .catch(() => {
                                _store.commit("set_draft_alert", true);
                                // console.log(234);
                                // callback();
                                loadProfile('1', _store, callback);
                            });
                    }

                } else {
                    _store.commit("set_draft_alert", false);
                    // 无草稿
                    // callback();
                    loadProfile('1', _store, callback);
                }
            } else {
                _store.commit("set_draft_alert", false);
                // Message({
                //     message: res.codemsg,
                //     type: "error"
                // });
                loadProfile('1', _store, callback);
                // callback();
            }
        });
}

function loadProfile(path, _store, callback) {
    if (path === '/admin/profile') {
        loadDraftProfile(_store, callback);
        return;
    }

    post({
        action: "getsupinfo",
        uid: _store.state.supinfo.accountid,
        token: _store.state.token
    }, res => {
        // console.log("##### profile: ", res);
        if (res.code === "0") {
            _store.commit("updatesupprofile", res.data);
        }

        if (callback) {
            callback(res);
        }
    })
}

export default router;